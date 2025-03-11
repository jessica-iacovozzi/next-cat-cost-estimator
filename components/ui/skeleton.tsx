import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "h-5 w-full animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="flex-1 w-full shadow-md rounded-xl flex flex-col h-full border p-6 space-y-4">
      <div className="space-y-2 flex justify-between">
        <div className="space-y-2 w-2/3">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <Skeleton className="h-12 w-1/4" />
      </div>
      <div className="space-y-4 flex-1">
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-16 flex-1" />
              <Skeleton className="h-16 w-1/6" />
              <Skeleton className="h-16 w-1/6" />
            </div>
          ))}
        </div>
        <div className="pt-4 mt-4 border-t">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EstimatesSkeletonLoader() {
  return (
    <div className="flex flex-col justify-center w-full">
      <div className="flex flex-col md:flex-row mb-4 justify-between w-full md:px-24">
        <Skeleton className="h-8 w-1/2 md:w-1/4 mb-4 md:mb-12" />
        <Skeleton className="h-10 w-1/3 md:w-1/6" />
      </div>
      <div className="flex flex-col w-full md:px-32">
        {Array.from({ length: 2 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function BreakdownSkeletonLoader() {
  return (
    <div className="flex-1 w-full shadow-md rounded-xl border">
      <div className="px-6 py-4 flex justify-between items-center border-b gap-40">
        <div className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="px-6 py-4 space-y-4">
        <table className="w-full">
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                <td className="py-3 border-b">
                  <Skeleton className="h-5 w-full" />
                </td>
                <td className="py-3 border-b w-24 text-center">
                  <Skeleton className="h-5 w-16 mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-4 border-t">
                <Skeleton className="h-6 w-16" />
              </td>
              <td className="py-4 border-t w-24 text-center">
                <Skeleton className="h-6 w-16 mx-auto" />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export function FormSkeletonLoader() {
  return (
    <div className="flex-none p-5 shadow-lg rounded-xl border">
      <div className="space-y-2 mb-4">
        <Skeleton className="h-6 w-80" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-40" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
