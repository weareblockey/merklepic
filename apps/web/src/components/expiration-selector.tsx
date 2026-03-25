import { cn } from "@merklepic/ui/lib/utils";
import { EXPIRATION_OPTIONS } from "../lib/constants";

interface ExpirationSelectorProps {
	value: number;
	onChange: (days: number) => void;
}

export function ExpirationSelector({
	value,
	onChange,
}: ExpirationSelectorProps) {
	return (
		<div className="flex flex-col gap-2">
			<span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
				Expires in
			</span>
			<div className="flex flex-wrap gap-2">
				{EXPIRATION_OPTIONS.map((option) => {
					const selected = value === option.days;
					return (
						<button
							key={option.days}
							type="button"
							onClick={() => onChange(option.days)}
							className={cn(
								"h-8 border-2 px-3 font-semibold text-xs tracking-wider transition-none",
								"cursor-pointer rounded-none",
								selected
									? "border-accent-brand bg-accent-brand/15 text-accent-brand shadow-[0_0_8px_var(--accent-brand),2px_2px_0_0_var(--accent-brand)]"
									: "border-border bg-background text-muted-foreground hover:border-accent-brand/60 hover:text-foreground",
							)}
							aria-pressed={selected}
						>
							{option.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
