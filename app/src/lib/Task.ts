type TaskProps = {
  deps?: string[];
  restrict?: boolean;
  maxWorkers?: number;
};

type WorkerMessageEvent = MessageEvent & {
  data: {
    code: string;
    context: Record<string, any>;
    uid: string;
    wid: number;
    res?: any;
    error?: boolean;
  };
};

let count = 0;
let globalRestrict = true;
let globalDeps: string[] = [];
let globalMaxWorkers: number | undefined;
const pool: Task[] = [];

export const init = (props?: TaskProps): void => {
  const { deps, restrict = true, maxWorkers } = props || {};
  globalRestrict = restrict;
  globalDeps = deps || [];

  globalMaxWorkers = maxWorkers;
  if (globalMaxWorkers) {
    for (let i = 0; i < globalMaxWorkers; ++i) {
      pool.push(new Task());
    }
  }
};

export const getFromPool = (): Task | void => {
  if (pool.length === 0) {
    return console.error("getFromPool requires maxWorkers option set in init");
  }
  const i = Math.round(Math.random() * (globalMaxWorkers! - 1));
  return pool[i];
};

export const disposePool = (): void => {
  for (let i = 0; i < globalMaxWorkers!; ++i) {
    pool[i].destroy();
  }
};

class Task {
  private queue: Record<string, (res: any) => void> = {};
  private reject: Record<string, (reason?: any) => void> = {};
  private evalWorker: Worker;
  private wid: number;

  constructor(props?: TaskProps) {
    const { deps = globalDeps, restrict = globalRestrict } = props || {};

    let externalScriptsDirective = "";

    if (deps) {
      const ext = JSON.stringify(deps).replace(/[\[\]]/g, "");
      externalScriptsDirective = `self.importScripts(${ext})`;
    }

    const restrictSandboxDirective = restrict
      ? `dangObjects.forEach(d => self[d] = {})`
      : "";

    const workerRunnerStrFunc = `
      const dangObjects = ['Worker', 'fetch', 'location', 'IndexedDB', 'WebTransport', 'WebSocketStream', 'BroadcastChannel', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'WorkerNavigator', 'navigator'];
      ${externalScriptsDirective}
      ${restrictSandboxDirective}
      
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

      self.onmessage = async function(event) {
          const {code, context, uid, wid} = event.data;
          const keys = Object.keys(context);
          const keysStr = keys.join(',');
          try {
              const func = new AsyncFunction(keysStr, code);
              const arrkeys = keys.map(k => context[k]);
              const res = await func(...arrkeys);
              self.postMessage({uid, res, wid});
          } catch (res) {
              self.postMessage({uid, res, error: true, wid});
          }
      };
    `;

    const workerBlob = new Blob(
      [workerRunnerStrFunc.replace(/^function .+\\{?|\\}$/g, "")],
      { type: "module" }
    );
    const workerBlobUrl = URL.createObjectURL(workerBlob);
    this.evalWorker = new Worker(workerBlobUrl);
    count++;
    this.wid = count;

    const callback = (event: WorkerMessageEvent): void => {
      const { wid, uid, res, error } = event.data;
      if (error) {
        this.reject[uid](res);
      } else {
        this.queue[uid](res);
      }

      delete this.reject[uid];
      delete this.queue[uid];
    };

    this.evalWorker.addEventListener("message", callback, false);
  }

  public exe(code: string, context: Record<string, any> = {}): Promise<any> {
    const uid = `${this.wid}_${Date.now()}_${Math.random()}`;
    this.evalWorker.postMessage({ code, context, uid, wid: this.wid });
    return new Promise((resolve, reject) => {
      this.queue[uid] = resolve;
      this.reject[uid] = reject;
    });
  }

  public destroy(): void {
    this.evalWorker.terminate();
  }
}

export default Task;
