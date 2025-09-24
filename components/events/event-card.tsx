"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin } from "lucide-react"

type Props = {
  event: {
    id: string
    title: string
    coverUrl: string
    city: string
    date: string
    fandom: string
    tags: string[]
  }
}

export function EventCard({ event }: Props) {
  const date = new Date(event.date)
  const dateLabel = date.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <Image
            src={event.coverUrl}
            alt={event.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium leading-tight line-clamp-2">{event.title}</h3>
          <Badge variant="secondary">{event.fandom}</Badge>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>{dateLabel}</span>
          </div>
          <div className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{event.city}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {event.tags.map((t) => (
            <Badge key={t} variant="outline" className="rounded-full">
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/events/${event.id}`}>View details</Link>
        </Button>
        <Button size="sm">RSVP</Button>
      </CardFooter>
    </Card>
  )
}


