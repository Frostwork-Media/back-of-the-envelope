"use client";
import type { Send2 } from "iconsax-react";

type NavIconButtonProps = {
  icon: typeof Send2;
  hoverClass?: string;
};

export function NavIconButton({
  icon: Icon,
  hoverClass = "hover:text-brand",
  ...props
}: NavIconButtonProps & Omit<React.ComponentProps<"button">, "className">) {
  return (
    <button
      className={`flex h-16 w-16 shrink-0 items-center justify-center text-white/70 ${hoverClass}`}
      {...props}
    >
      <Icon className="h-7 w-7 transition-colors" />
    </button>
  );
}
