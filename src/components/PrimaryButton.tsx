import React, { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface PrimaryButtonProps extends ComponentProps<"button"> {
  parentClassName?: string; // Custom style class for additional styling via props
}
export default function PrimaryButton({ className, parentClassName, ...props }: PrimaryButtonProps) {
  return (
    <div
      className={twMerge(
        "drop-shadow-[0px_0px_5px_#FFFFFF99] hover:drop-shadow-[0px_0px_10px_#FFFFFF99] has-[:focus]:drop-shadow-[0px_0px_10px_#FFFFFF99] flex flex-col items-stretch ",
        parentClassName,
      )}
    >
      <button
        className={twMerge(
          "wedges-clip focus:outline-none focus:ring-2 focus:ring-offset-2 text-lg bg-gradient-to-tr from-purple to-pink grid place-items-center font-brand-secondary",
          className,
        )}
        {...props}
      />
    </div>
  );
}
