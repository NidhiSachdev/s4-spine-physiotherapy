interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-charcoal/10 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
      ))}
    </div>
  );
}
