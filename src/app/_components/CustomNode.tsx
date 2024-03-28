import { type NodeProps, Handle, Position } from "@xyflow/react";
import { memo } from "react";
import {
  usePersistedStore,
  useSetVariableAtLineNumber,
} from "~/lib/usePersistedStore";
import { Slider } from "./slider";

export const CustomNode = memo(function CustomNode({
  data,
  id,
}: NodeProps<{
  label: string;
  description: string;
  lineNumber: number;
  control?: string;
}>) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!-translate-y-1/2 !translate-x-0 opacity-0"
      />
      <div className="grid w-[240px] overflow-hidden rounded-lg bg-gradient-to-r from-brand-400 to-brand-500 p-px text-white">
        <div className="grid gap-4 rounded-t-lg bg-neutral-800 p-4 pt-3">
          <div className="grid gap-1">
            <h2 className="text-wrap-balance text-base leading-tight">
              {data.label}
            </h2>
            <p className="text-xs leading-tight text-white/50">
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
        position={Position.Right}
        className="!-translate-y-1/2 !translate-x-0 opacity-0"
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
      <Slider
        className="nodrag"
        value={[Number(defaultValue)]}
        onValueChange={(value) => {
          const v = value[0];
          if (typeof v !== "number") return;
          setVariableAtLineNumber(varName, lineNumber, v.toString());
        }}
        min={Number(args[0])}
        max={Number(args[1])}
        step={Number(args[2])}
      />
    );
  }
  return null;
}

function DisplayVariableValue({ varName }: { varName: string }) {
  const value = usePersistedStore((state) => state.values[varName] ?? "???");
  return (
    <div className="custom-numbers overflow-hidden text-ellipsis p-1 px-2 text-center font-mono font-bold tabular-nums text-white">
      {Number(Number(value).toPrecision(5)).toString()}
    </div>
  );
}
