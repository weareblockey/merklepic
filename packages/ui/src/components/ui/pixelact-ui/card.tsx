import {
	Card as ShadcnCard,
	CardAction as ShadcnCardAction,
	CardContent as ShadcnCardContent,
	CardDescription as ShadcnCardDescription,
	CardFooter as ShadcnCardFooter,
	CardHeader as ShadcnCardHeader,
	CardTitle as ShadcnCardTitle,
} from "@merklepic/components/ui/card";

import { cn } from "@merklepic/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

import "@merklepic/components/ui/pixelact-ui/styles/styles.css";

export const cardVariants = cva("", {
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

export interface CardProps
	extends React.ComponentProps<"div">,
		VariantProps<typeof cardVariants> {
	asChild?: boolean;
}

function Card({ ...props }: CardProps) {
	const { className, font } = props;

	return (
		<ShadcnCard
			{...props}
			className={cn(
				"box-shadow-margin rounded-none border-0 bg-card shadow-(--pixel-box-shadow)",
				cardVariants({ font }),
				className,
			)}
		/>
	);
}

function CardHeader({ ...props }: CardProps) {
	const { className } = props;

	return <ShadcnCardHeader className={cn("", className)} {...props} />;
}

function CardTitle({ ...props }: CardProps) {
	const { className } = props;

	return (
		<ShadcnCardTitle
			className={cn("font-normal text-lg", className)}
			{...props}
		/>
	);
}

function CardDescription({ ...props }: CardProps) {
	const { className } = props;

	return <ShadcnCardDescription className={cn(className)} {...props} />;
}

function CardAction({ ...props }: CardProps) {
	const { className } = props;

	return <ShadcnCardAction className={cn(className)} {...props} />;
}

function CardContent({ ...props }: CardProps) {
	const { className } = props;

	return <ShadcnCardContent className={cn(className)} {...props} />;
}

function CardFooter({ ...props }: CardProps) {
	const { className } = props;

	return (
		<ShadcnCardFooter
			data-slot="card-footer"
			className={cn(className)}
			{...props}
		/>
	);
}

export {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
};
