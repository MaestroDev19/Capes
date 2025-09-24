"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { CalendarDays, MapPin, Users } from "lucide-react"

export default function EventDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [isRsvping, setIsRsvping] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)

  const event = useMemo(
    () => ({
      id: params?.id ?? "1",
      title: "Cosplay Meetup: Night City",
      coverUrl: "/globe.svg",
      city: "San Francisco",
      date: "2025-10-12T18:00:00Z",
      fandom: "Cyberpunk 2077",
      tags: ["cosplay", "photowalk"],
      host: { name: "@panam", avatarUrl: "/window.svg" },
      attendees: 128,
      description:
        "Join fellow chooms for a Night City-themed cosplay walk and shoot. Bring your best fits and photo gear!",
    }),
    [params]
  )

  function handleConfirm() {
    setOpenConfirm(false)
    setIsRsvping(true)
    // Simulate optimistic UI; no backend yet
    setTimeout(() => {
      setIsRsvping(false)
      toast({ title: "RSVP confirmed", description: "You're in! See you there." })
    }, 900)
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        Back
      </Button>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src={event.coverUrl}
                alt={event.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {event.title}
                </h1>
                <Badge variant="secondary">{event.fandom}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(event.date).toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.city}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {event.attendees} going
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                {event.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {event.tags.map((t) => (
                  <Badge key={t} variant="outline" className="rounded-full">
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="mt-6">
                <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
                  <DialogTrigger asChild>
                    <Button disabled={isRsvping}>{isRsvping ? "RSVP'ing..." : "RSVP"}</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm RSVP</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                      RSVP to {event.title}? You can change this later.
                    </p>
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setOpenConfirm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleConfirm}>Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground">Hosted by</div>
              <div className="mt-2 font-medium">{event.host.name}</div>
              <div className="mt-4 text-sm text-muted-foreground">
                Share, rules, and location details can go here.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}


