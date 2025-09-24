import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="h-40 w-full" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </CardFooter>
    </Card>
  )
}

export function EventGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}


