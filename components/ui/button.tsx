"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-2xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-blue/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-stone-800 text-cream shadow-soft hover:bg-stone-700 hover:shadow-lg",
        secondary:
          "bg-latte-beige text-stone-800 hover:bg-coffee-hover",
        cloud:
          "bg-soft-white/90 text-stone-800 border border-white/60 shadow-soft hover:bg-white hover:shadow-glass",
        coffee:
          "bg-espresso text-cream shadow-soft hover:bg-coffee-brown-light disabled:bg-espresso/70 disabled:opacity-100",
        bold:
          "rounded-2xl border-2 border-espresso bg-dusty-blue text-cream shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0 active:translate-y-0 active:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0",
        "bold-outline":
          "rounded-2xl border-2 border-espresso bg-cream text-espresso shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-x-0 active:translate-y-0 active:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0",
        ghost: "hover:bg-coffee-hover/80 text-stone-800",
        link: "text-sky-blue underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        default: "h-11 px-6 text-base",
        lg: "h-12 px-8 text-lg",
        xl: "h-14 px-10 text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
