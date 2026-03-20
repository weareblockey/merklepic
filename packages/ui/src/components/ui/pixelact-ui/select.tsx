import {
	Select as ShadcnSelect,
	SelectContent as ShadcnSelectContent,
	SelectGroup as ShadcnSelectGroup,
	SelectItem as ShadcnSelectItem,
	SelectLabel as ShadcnSelectLabel,
	SelectSeparator as ShadcnSelectSeparator,
	SelectValue as ShadcnSelectValue,
} from "@merklepic/components/ui/select";
import { cn } from "@merklepic/ui/lib/utils";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cva, type VariantProps } from "class-variance-authority";

import "@merklepic/components/ui/pixelact-ui/styles/styles.css";

export const inputVariants = cva("text-foreground", {
	variants: {
		font: {
			normal: "",
			pixel: "pixel-font",
		},
	},
	defaultVariants: {
		font: "pixel",
	},
});

export interface SelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement>,
		VariantProps<typeof inputVariants> {
	asChild?: boolean;
}

function Select({ ...props }: React.ComponentProps<typeof ShadcnSelect>) {
	return <ShadcnSelect {...props} />;
}

function SelectGroup({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
	return <ShadcnSelectGroup {...props} />;
}

interface SelectValueProps
	extends React.ComponentProps<typeof SelectPrimitive.Value>,
		VariantProps<typeof inputVariants> {
	asChild?: boolean;
}

function SelectValue({ font, ...props }: SelectValueProps) {
	return (
		<ShadcnSelectValue className={cn(inputVariants({ font }))} {...props} />
	);
}

function SelectTrigger({
	children,
	className,
	font,
	size = "default",
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
	size?: "sm" | "default";
	font?: "normal" | "pixel";
}) {
	return (
		<div
			className={cn(
				"box-shadow-margin relative shadow-(--pixel-box-shadow)",
				inputVariants({ font }),
				className,
			)}
		>
			<SelectPrimitive.Trigger
				data-slot="select-trigger"
				data-size={size}
				className={cn(
					"flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-none border-0 border-input bg-background px-3 py-2 text-sm shadow-xs outline-none ring-0 transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[size=default]:h-9 data-[size=sm]:h-8 data-[placeholder]:text-muted-foreground *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-background dark:aria-invalid:ring-destructive/40 dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
					className,
				)}
				{...props}
			>
				{children}
				<SelectPrimitive.Icon
					render={
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="32"
							height="32"
							viewBox="0 0 24 24"
							className="size-6 opacity-50"
						/>
					}
				>
					<path
						className="fill-foreground"
						d="M7 8H5v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2h-2v-2H9v-2H7z"
					/>
				</SelectPrimitive.Icon>
			</SelectPrimitive.Trigger>
		</div>
	);
}

export interface SelectContentProps
	extends React.ComponentProps<typeof SelectPrimitive.Content>,
		VariantProps<typeof inputVariants> {
	asChild?: boolean;
}

function SelectContent({
	className,
	children,
	font,
	...props
}: SelectContentProps) {
	return (
		<ShadcnSelectContent
			className={cn(
				"relative mt-2 rounded-none border-none bg-background shadow-(--pixel-box-shadow)",
				inputVariants({ font }),
				className,
			)}
			{...props}
		>
			{children}
		</ShadcnSelectContent>
	);
}

function SelectLabel({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return <ShadcnSelectLabel className={cn(className)} {...props} />;
}

function SelectItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<ShadcnSelectItem
			className={cn(
				className,
				"rounded-none border-ring/0 border-y-3 border-dashed hover:border-foreground dark:hover:border-ring",
			)}
			{...props}
		>
			{children}
		</ShadcnSelectItem>
	);
}

function SelectSeparator({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return <ShadcnSelectSeparator className={cn(className)} {...props} />;
}

function SelectScrollDownButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
	return (
		<SelectPrimitive.ScrollDownButton
			data-slot="select-scroll-down-button"
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className,
			)}
			{...props}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				className="size-4"
			>
				<path
					className="fill-foreground"
					d="M7 8H5v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2V8h-2v2h-2v2h-2v2h-2v-2H9v-2H7z"
				/>
			</svg>
		</SelectPrimitive.ScrollDownButton>
	);
}

function SelectScrollUpButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
	return (
		<SelectPrimitive.ScrollUpButton
			data-slot="select-scroll-up-button"
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className,
			)}
			{...props}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="32"
				height="32"
				viewBox="0 0 24 24"
				className="size-4"
			>
				<path
					className="fill-foreground"
					d="M7 16H5v-2h2v-2h2v-2h2V8h2v2h2v2h2v2h2v2h-2v-2h-2v-2h-2v-2h-2v2H9v2H7z"
				/>
			</svg>
		</SelectPrimitive.ScrollUpButton>
	);
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
