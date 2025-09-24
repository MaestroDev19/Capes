import { Button } from "@/components/ui/button"

export function EventEmpty({ onReset }: { onReset?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border py-10 text-center">
      <div className="text-base font-medium">No events match your filters</div>
      <p className="text-sm text-muted-foreground">Try adjusting city, fandom, or date.</p>
      <Button variant="secondary" size="sm" onClick={onReset}>Reset filters</Button>
    </div>
  )
}


