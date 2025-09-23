"use client";
import { useEffect, useState } from "react";
import { createClient as createBrowserSupabase } from "@/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

/**
 * ProfileForm for Capes fandom app (entertainment, anime, gaming, etc.)
 * Lets users set username, country, and select fandom interests.
 */
type Interests = Record<string, string>;

const INTEREST_OPTIONS = [
  // Core Media & Genres
  "Anime",
  "Manga",
  "Comics",
  "Video Games",
  "Console/PC Gaming",
  "Movies",
  "TV Shows",
  "Esports",
  "Cosplay",
  "Fan Art",
  "Conventions",
  "Collecting",
  "Streaming ",
  "Content Creation",
  "Fantasy",
  "Board/Tabletop/TCG",
  "Sci-Fi",
];


const COUNTRY_OPTIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "India",
  "Nigeria",
  "South Africa",
  "Brazil",
  "Japan",
  "Australia",
  "Other",
];

export function ProfileForm({ userId }: { userId: string }) {
  const supabase = createBrowserSupabase()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState("")
  const [country, setCountry] = useState("")
  const [interests, setInterests] = useState<Interests>({})
  const [customInterest, setCustomInterest] = useState("")

  // Helper: get selected interests as a Set
  function getSelectedSet(): Set<string> {
    return new Set(Object.values(interests))
  }

  // Helper: set interests from array (preserves order)
  function setFromArray(values: string[]) {
    const map: Interests = {}
    values.forEach((v, idx) => (map[String(idx + 1)] = v))
    setInterests(map)
  }

  // Toggle an interest in the set
  function toggleInterest(value: string) {
    const set = getSelectedSet()
    if (set.has(value)) set.delete(value)
    else set.add(value)
    setFromArray(Array.from(set))
  }

  // Fetch profile data on mount
  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const { data } = await supabase.from("profiles").select("username, country, interests").eq("id", userId).single()
      if (!isMounted) return
      setUsername(data?.username ?? "")
      setCountry(data?.country ?? "")
      setInterests((data?.interests as Interests) ?? {})
      setLoading(false)
    })()
    return () => {
      isMounted = false
    }
  }, [supabase, userId])

  // Disable submit if required fields are missing
  const disabled = loading || !username.trim() || !country.trim() || Object.keys(interests).length === 0

  // Handle form submit
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      username: username.trim(),
      country: country.trim(),
      interests,
      bio: "New user",
    })
    setLoading(false)
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Profile Created! 🎉",
        description: "Welcome to the Capes fandom community!",
      })
      window.location.replace("/")
    }
  }

  // Add custom interest handler
  function handleAddCustom() {
    const value = customInterest.trim()
    if (!value) return
    const set = getSelectedSet()
    set.add(value)
    setFromArray(Array.from(set))
    setCustomInterest("")
  }

  const selectedCount = Object.keys(interests).length
  const progressPercentage = Math.min(
    (((username ? 1 : 0) + (country ? 1 : 0) + (selectedCount > 0 ? 1 : 0)) / 3) * 100,
    100,
  )

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Profile completion</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="gradient-primary h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Username Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-base font-medium">
              Choose your username
            </Label>
            <p className="text-sm text-muted-foreground">This is how other fans will know you in the community</p>
          </div>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. animegamer123"
            required
            disabled={loading}
            autoComplete="username"
            className="h-12 text-base"
          />
        </div>

        {/* Country Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-base font-medium">
              Where are you from?
            </Label>
            <p className="text-sm text-muted-foreground">Connect with fans from your region</p>
          </div>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger id="country" aria-label="Select country" disabled={loading} className="h-12 text-base">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interests Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">What fandoms are you into?</Label>
            <p className="text-sm text-muted-foreground">
              Select at least one to help us personalize your experience
              {selectedCount > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gradient-primary text-white">
                  {selectedCount} selected
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INTEREST_OPTIONS.map((opt) => {
              const selected = getSelectedSet().has(opt)
              return (
                <Button
                  key={opt}
                  type="button"
                  variant={selected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleInterest(opt)}
                  disabled={loading}
                  aria-pressed={selected}
                  className={`h-10 text-sm transition-all duration-200 ${
                    selected
                      ? "gradient-primary text-white shadow-lg scale-105"
                      : "hover:border-primary/50 hover:bg-accent"
                  }`}
                >
                  {opt}
                </Button>
              )
            })}
          </div>

          {/* Custom Interest Input */}
          <div className="flex items-center gap-3 pt-2">
            <Input
              id="custom-interest"
              placeholder="Add custom fandom (e.g. VTubers, Webtoons)"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddCustom()
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddCustom}
              disabled={loading || !customInterest.trim()}
              className="px-6"
            >
              Add
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={disabled}
            className="w-full h-12 text-base font-medium gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating your profile...
              </div>
            ) : (
              "Continue to Capes →"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}