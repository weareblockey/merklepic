import { cn } from "@merklepic/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

import "@merklepic/components/ui/pixelact-ui/styles/styles.css";

const emptyMediaVariants = cva(
	"flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-transparent",
				icon: "relative flex size-12 shrink-0 items-center justify-center bg-muted text-foreground",
			},
			font: {
				normal: "",
				pixel: "pixel-font",
			},
		},
		defaultVariants: {
			variant: "default",
			font: "pixel",
		},
	},
);

function Empty({
	className,
	font,
	...props
}: React.ComponentProps<"div"> & { font?: "normal" | "pixel" }) {
	return (
		<div
			data-slot="empty"
			className={cn(
				"flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-6 text-center md:p-12",
				emptyMediaVariants({ font }),
				className,
			)}
			{...props}
		/>
	);
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="empty-header"
			className={cn(
				"flex max-w-sm flex-col items-center gap-2 text-center",
				className,
			)}
			{...props}
		/>
	);
}

function EmptyMedia({
	className,
	variant = "default",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
	return (
		<div
			className={cn(
				"box-shadow-margin relative size-max shadow-(--pixel-box-shadow)",
				className,
			)}
		>
			<div
				data-slot="empty-icon"
				data-variant={variant}
				className={cn(emptyMediaVariants({ variant, className }))}
				{...props}
			/>
		</div>
	);
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="empty-title"
			className={cn("text-foreground text-lg tracking-tight", className)}
			{...props}
		/>
	);
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="empty-description"
			className={cn(
				"text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
				className,
			)}
			{...props}
		/>
	);
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="empty-content"
			className={cn(
				"flex w-full min-w-0 max-w-sm flex-col items-center gap-4 text-balance text-sm",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
};
