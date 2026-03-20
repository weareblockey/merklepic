import { cn } from "@merklepic/ui/lib/utils";
import * as React from "react";
import "@merklepic/components/ui/pixelact-ui/styles/styles.css";

export interface PixelInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	disabled?: boolean;
	className?: string;
}

const Input = React.forwardRef<HTMLInputElement, PixelInputProps>(
	({ className, disabled, ...props }, ref) => {
		return (
			<input
				className={cn(
					"pixel__input pixel-font box-shadow-margin max-w-full bg-background p-2 text-foreground shadow-(--pixel-box-shadow) outline-none placeholder:text-sm disabled:opacity-40 md:placeholder:text-base",
					disabled && "disabled:cursor-not-allowed disabled:opacity-40",
					className,
				)}
				disabled={disabled}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "PixelInput";

export { Input };
