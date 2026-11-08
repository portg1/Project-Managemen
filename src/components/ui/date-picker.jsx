import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "cn";

const DatePicker = React.forwardRef(function DatePicker(
	{ label, error, id, className, ...props },
	ref,
) {
	const generatedId = React.useId();
	const inputId = id || generatedId;
	return (
		<div className="grid gap-1.5">
			{label && (
				<label htmlFor={inputId} className="text-sm font-medium">
					{label}
				</label>
			)}
			<Input
				ref={ref}
				id={inputId}
				type="date"
				aria-invalid={error ? true : undefined}
				aria-describedby={error ? `${inputId}-error` : undefined}
				className={cn(className)}
				{...props}
			/>
			{error && (
				<p
					id={`${inputId}-error`}
					role="alert"
					className="text-sm text-destructive"
				>
					{error}
				</p>
			)}
		</div>
	);
});

export { DatePicker };
