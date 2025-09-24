"use client"

import { useMemo, useState } from "react"
import { EventFilters, type EventFilterState } from "@/components/events/event-filters"
import { EventCard } from "@/components/events/event-card"
import { EventGridSkeleton } from "@/components/events/event-skeletons"
import { EventEmpty } from "@/components/events/event-empty"
// pagination removed in favor of sectioned layout
import { Suspense } from "react"

type EventItem = {
  id: string
  title: string
  coverUrl: string
  country: string
  date: string
  fandom: string
  tags: string[]
  kind: "virtual" | "irl"
  trending?: boolean
}


const countries = ["United States", "Canada", "United Kingdom", "Germany", "France", "Italy", "Spain", "Netherlands", "Sweden", "Norway", "Denmark", "Finland", "Poland", "Russia", "Turkey", "Egypt", "Kenya", "Ghana", "Morocco", "Saudi Arabia", "United Arab Emirates"]
const demoEvents: EventItem[] = [
  {
    id: "1",
    title: "Cosplay Meetup: Night City",
    coverUrl: "/globe.svg",
    country: "United States",
    date: "2025-10-12T18:00:00Z",
    fandom: "Cyberpunk 2077",
    tags: ["cosplay", "photowalk"],
    kind: "irl",
    trending: true,
  },
  {
    id: "2",
    title: "Hyrule Fan Orchestra",
    coverUrl: "/vercel.svg",
    country: "United States",
    date: "2025-11-01T02:00:00Z",
    fandom: "Zelda",
    tags: ["music", "concert"],
    kind: "irl",
  },
  {
    id: "3",
    title: "Spider-Verse Sketch Jam",
    coverUrl: "/next.svg",
    country: "United States",
    date: "2025-09-28T20:00:00Z",
    fandom: "Marvel",
    tags: ["art", "meetup"],
    kind: "virtual",
    trending: true,
  },
]

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFilterState>({ query: "", country: null, fandom: null, date: null })

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return demoEvents.filter((e) => {
      if (filters.country && e.country !== filters.country) return false
      if (filters.fandom && e.fandom !== filters.fandom) return false
      if (q && !(`${e.title} ${e.tags.join(" ")}`.toLowerCase().includes(q))) return false
      // date filter demo stub
      return true
    })
  }, [filters])
  const categories = useMemo(() => Array.from(new Set(filtered.map((e) => e.fandom))), [filtered])
  const virtualEvents = useMemo(() => filtered.filter((e) => e.kind === "virtual"), [filtered])
  const irlEvents = useMemo(() => filtered.filter((e) => e.kind === "irl"), [filtered])
  const trendingEvents = useMemo(() => filtered.filter((e) => e.trending), [filtered])

  function handleApply(next: EventFilterState) {
    setFilters(next)
  }

  function handleReset() {
    setFilters({ query: "", country: null, fandom: null, date: null })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Discover Events</h1>
      </div>
      <EventFilters onApply={handleApply} onReset={handleReset} />
 
      <Suspense fallback={<EventGridSkeleton />}>
        {filtered.length === 0 ? (
          <EventEmpty onReset={handleReset} />
        ) : (
          <>
            {/* Categories section */}
            <section className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Categories we think you&#39;ll like</h2>
              </div>
              <div className="no-scrollbar -mx-2 flex snap-x gap-3 overflow-x-auto px-2 pb-2">
                {categories.map((cat) => (
                  <div key={cat} className="min-w-[160px] snap-start rounded-lg border bg-card p-4 shadow-sm">
                    <div className="text-sm text-muted-foreground">Fandom</div>
                    <div className="mt-1 font-medium">{cat}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Virtual Events */}
            <section className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Virtual Events</h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {virtualEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>

            {/* IRL Events */}
            <section className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">IRL Events</h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {irlEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>

            {/* Trending Events */}
            <section className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Trending Events</h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {trendingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          </>
        )}
      </Suspense>
    </>
  )
}


