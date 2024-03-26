import * as RadixSlider from "@radix-ui/react-slider";
import type { SliderProps } from "@radix-ui/react-slider";

export const Slider = (props: SliderProps) => (
  <RadixSlider.Root
    {...props}
    className="group relative flex h-4 w-full touch-none select-none items-center"
  >
    <RadixSlider.Track className="relative h-[5px] grow rounded-full bg-neutral-900">
      <RadixSlider.Range className="absolute h-full rounded-full bg-brand-100 group-hover:bg-white" />
    </RadixSlider.Track>
    <RadixSlider.Thumb className="block h-4 w-4 rounded-full bg-brand-100 focus:shadow-[0_0_0_3px] focus:shadow-brand-700/70 focus:outline-none group-hover:bg-white" />
  </RadixSlider.Root>
);
