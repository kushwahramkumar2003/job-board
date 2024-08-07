import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
    return (
        <div className="max-w-full mx-auto h-fit w-full flex flex-col sm:flex-row items-start gap-4 border border-gray-200 rounded-md px-4 py-3">
            <div className="flex-shrink-0 p-2">
                <Skeleton className="h-20 w-20 rounded-full" />
            </div>
            <div className="p-2 flex-grow flex flex-col gap-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="flex items-center justify-between w-full">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>
        </div>
    );
}
