"use client";
import type { Send2 } from "iconsax-react";
import { cn } from "~/lib/cn";

type NavIconButtonProps = {
  icon: typeof Send2;
  hoverClass?: string;
};

export function NavIconButton({
  icon: Icon,
  className = "hover:text-brand",
  ...props
}: NavIconButtonProps & React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        `flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white/70`,
        className,
      )}
      {...props}
    >
      <Icon className="h-7 w-7 transition-colors" />
    </button>
  );
}
