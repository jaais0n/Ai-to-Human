export function Skeleton({ className = '', lines = 1, height = 'h-4' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton rounded-lg ${height} ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonBlock({ className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <Skeleton lines={1} height="h-5" />
      <Skeleton lines={3} height="h-4" />
      <Skeleton lines={1} height="h-4" className="w-2/3" />
      <div className="pt-2">
        <Skeleton lines={4} height="h-4" />
      </div>
      <Skeleton lines={2} height="h-4" />
      <Skeleton lines={1} height="h-4" className="w-1/2" />
    </div>
  );
}
