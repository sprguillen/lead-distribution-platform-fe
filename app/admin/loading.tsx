export default function AdminLoading() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading">
      <div className="h-6 w-40 animate-pulse rounded bg-border" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-20 animate-pulse rounded-xl border border-border bg-surface"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl border border-border bg-surface" />
    </div>
  );
}
