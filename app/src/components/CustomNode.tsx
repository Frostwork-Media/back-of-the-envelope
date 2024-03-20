import { NodeProps, Handle, Position } from "@xyflow/react";
import { memo } from "react";
import {
  usePersistedStore,
  useSetVariableAtLineNumber,
} from "../lib/usePersistedStore";

export const CustomNode = memo(function CustomNode({ data, id }: NodeProps) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="opacity-0 -translate-x-1/2 translate-y-0"
      />
      <div className="grid rounded-2xl border border-black overflow-hidden">
        <div className="w-[240px] bg-white p-4 pt-3 grid gap-4 font-semibold">
          <div className="grid gap-1">
            <h2 className="text-base font-semibold text-gray-800 leading-tight text-wrap-balance">
              {data.label}
            </h2>
            <p className="text-xs text-black/50 leading-tight">
              {data.description}
            </p>
          </div>
          {data.control ? (
            <HandleControl
              directive={data.control}
              lineNumber={data.lineNumber}
              varName={id}
            />
          ) : null}
        </div>
        <DisplayVariableValue varName={id} />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="opacity-0 -translate-x-1/2 translate-y-0"
      />
    </>
  );
});

function HandleControl({
  directive,
  lineNumber,
  varName,
}: {
  directive: string;
  lineNumber: number;
  varName: string;
}) {
  const setVariableAtLineNumber = useSetVariableAtLineNumber();
  const [controlType, ...args] = directive.split(" ");
  const defaultValue = usePersistedStore((state) => state.values[varName]);

  if (controlType === "range") {
    return (
      <input
        className="nodrag"
        type="range"
        min={args[0]}
        max={args[1]}
        step={args[2]}
        defaultValue={defaultValue}
        onChange={(e) => {
          setVariableAtLineNumber(varName, lineNumber, e.target.value);
        }}
      />
    );
  }
  return null;
}

function DisplayVariableValue({ varName }: { varName: string }) {
  const value = usePersistedStore((state) => state.values[varName] || "???");
  return (
    <div className="bg-black text-white p-2 text-center overflow-hidden text-ellipsis text-lg font-semibold">
      {value}
    </div>
  );
}
