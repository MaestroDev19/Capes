"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type EventFilterState = {
  query: string
  city: string | null
  fandom: string | null
  date: string | null
}

const cities = ["San Francisco", "Seattle", "New York"]
const fandoms = ["Cyberpunk 2077", "Zelda", "Marvel"]

type Props = {
  className?: string
  onApply?: (filters: EventFilterState) => void
  onReset?: () => void
}

export function EventFilters({ className, onApply, onReset }: Props) {
  const [filters, setFilters] = useState<EventFilterState>({
    query: "",
    city: null,
    fandom: null,
    date: null,
  })

  const isActive = useMemo(() => {
    return !!(filters.query || filters.city || filters.fandom || filters.date)
  }, [filters])

  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-6", className)}>
      <div className="lg:col-span-2">
        <Input
          placeholder="Search events, hosts, tags"
          value={filters.query}
          onChange={(e) => setFilters((f) => ({ ...f, query: e.target.value }))}
        />
      </div>
      <Select
        value={filters.city ?? undefined}
        onValueChange={(v) => setFilters((f) => ({ ...f, city: v }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.fandom ?? undefined}
        onValueChange={(v) => setFilters((f) => ({ ...f, fandom: v }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Fandom" />
        </SelectTrigger>
        <SelectContent>
          {fandoms.map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filters.date ?? undefined}
        onValueChange={(v) => setFilters((f) => ({ ...f, date: v }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="weekend">This Weekend</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2">
        <Button
          variant={isActive ? "default" : "secondary"}
          aria-label="Reset filters"
          onClick={() => {
            setFilters({ query: "", city: null, fandom: null, date: null })
            onReset?.()
          }}
        >
          Reset
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button aria-label="Apply filters" onClick={() => onApply?.(filters)}>
          Apply
        </Button>
      </div>
    </div>
  )
}


