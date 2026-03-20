import type { ReactNode } from "react";
import { Component } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
		console.error("Uncaught error:", error, errorInfo);
	}

	handleReset = () => {
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex h-screen w-full flex-col items-center justify-center gap-8 border-[3px] border-destructive bg-background px-4 py-10 text-center">
					{/* GAME OVER heading */}
					<h1 className="font-pixel text-destructive text-lg leading-loose tracking-widest drop-shadow-lg">
						GAME OVER
					</h1>

					{/* Error message */}
					<div className="flex max-w-sm flex-col gap-3">
						<p className="font-vt text-muted-foreground text-sm">
							Something went wrong.
						</p>
						<p className="break-all font-mono text-[10px] text-muted-foreground">
							{this.state.error?.message || "Unknown error"}
						</p>
					</div>

					{/* TRY AGAIN button */}
					<button
						type="button"
						onClick={this.handleReset}
						className="border-[3px] border-accent-brand bg-card px-6 py-2.5 font-pixel text-[10px] text-accent-brand transition-all hover:border-accent-hot hover:text-accent-hot active:scale-95"
					>
						TRY AGAIN
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
