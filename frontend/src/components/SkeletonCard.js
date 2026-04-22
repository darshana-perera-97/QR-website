export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm shadow-[0_4px_6px_-1px_rgba(16,185,129,0.2),0_2px_4px_-1px_rgba(16,185,129,0.1)]">
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-28" />
        </div>
      </div>
    </div>
  );
}
