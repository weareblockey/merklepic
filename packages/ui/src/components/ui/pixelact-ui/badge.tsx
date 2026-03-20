import { Badge as ShadcnBadge } from "@merklepic/components/ui/badge";
import { cn } from "@merklepic/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva("border-none", {
	variants: {
		font: {
			normal: "",
			pixel: "pixel-font",
		},
		variant: {
			default: "bg-primary",
			destructive: "bg-destructive",
			outline: "bg-background",
			secondary: "bg-secondary",
		},
	},
	defaultVariants: {
		font: "pixel",
		variant: "default",
	},
});

export interface BadgeProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof badgeVariants> {
	asChild?: boolean;
}

function Badge({ children, font, variant, ...props }: BadgeProps) {
	return (
		<div className={cn("relative inline-flex")}>
			<ShadcnBadge
				{...props}
				className={cn(
					"box-shadow-margin rounded-none shadow-(--pixel-box-shadow)",
					badgeVariants({ variant, font }),
				)}
				variant={variant}
			>
				{children}
			</ShadcnBadge>
		</div>
	);
}

export { Badge };
