'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/cn';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** Tailwind background class for the filled range + thumb border, e.g. "bg-red-600" */
  accentClassName?: string;
  /** Tailwind background class for the unfilled track, e.g. "bg-slate-700" */
  trackClassName?: string;
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, accentClassName = 'bg-red-600', trackClassName = 'bg-gray-200/80', ...props }, ref) => {
    const thumbCount = (props.value ?? props.defaultValue ?? [0]).length;
    const thumbBorderClassName = accentClassName.replace('bg-', 'border-');

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        {...props}
      >
        <SliderPrimitive.Track className={cn('relative h-1.5 w-full grow overflow-hidden rounded-full', trackClassName)}>
          <SliderPrimitive.Range className={cn('absolute h-full', accentClassName)} />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }).map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className={cn(
              'block h-4 w-4 rounded-full border-2 bg-white shadow transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              thumbBorderClassName
            )}
          />
        ))}
      </SliderPrimitive.Root>
    );
  }
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
