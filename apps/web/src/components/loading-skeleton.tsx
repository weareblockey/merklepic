import { Skeleton } from "@merklepic/ui/components/skeleton";

export function LoadingSkeleton() {
	return (
		<div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
			{Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((id) => (
				<div key={id} className="flex flex-col gap-0">
					<Skeleton className="aspect-[4/3] w-full animate-pulse" />
					<Skeleton className="mt-1 h-20 w-full animate-pulse" />
				</div>
			))}
		</div>
	);
}
