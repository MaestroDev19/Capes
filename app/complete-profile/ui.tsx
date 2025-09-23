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
  "Anime",
  "Manga",
  "Comics",
  "Movies",
  "TV Shows",
  "Gaming",
  "Esports",
  "Cosplay",
  "K-Pop",
  "Music",
  "Books",
'cosplay',
  "Collectibles",
  "Otaku",
  "Fanfiction",
  "Memes",
  "Streaming",
  "JRPGs",
  "Visual Novels",
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
  const supabase = createBrowserSupabase();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [interests, setInterests] = useState<Interests>({});
  const [customInterest, setCustomInterest] = useState("");

  // Helper: get selected interests as a Set
  function getSelectedSet(): Set<string> {
    return new Set(Object.values(interests));
  }

  // Helper: set interests from array (preserves order)
  function setFromArray(values: string[]) {
    const map: Interests = {};
    values.forEach((v, idx) => (map[String(idx + 1)] = v));
    setInterests(map);
  }

  // Toggle an interest in the set
  function toggleInterest(value: string) {
    const set = getSelectedSet();
    if (set.has(value)) set.delete(value);
    else set.add(value);
    setFromArray(Array.from(set));
  }

  // Fetch profile data on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("username, country, interests")
        .eq("id", userId)
        .single();
      if (!isMounted) return;
      setUsername(data?.username ?? "");
      setCountry(data?.country ?? "");
      setInterests((data?.interests as Interests) ?? {});
      setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, [supabase, userId]);

  // Disable submit if required fields are missing
  const disabled =
    loading ||
    !username.trim() ||
    !country.trim() ||
    Object.keys(interests).length === 0;

  // Handle form submit
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      username: username.trim(),
      country: country.trim(),
      interests,
      bio: "New user",
    });
    setLoading(false);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved",
        description: "Profile updated! Welcome to the Capes fandom community.",
      });
      window.location.replace("/");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. animegamer123"
          required
          disabled={loading}
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger
            id="country"
            aria-label="Select country"
            disabled={loading}
          >
            <SelectValue placeholder="Select a country" />
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
      <div className="space-y-2">
        <Label>Fandom Interests</Label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((opt) => {
            const selected = getSelectedSet().has(opt);
            return (
              <Button
                key={opt}
                type="button"
                variant={selected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleInterest(opt)}
                disabled={loading}
                aria-pressed={selected}
                className={selected ? "ring-2 ring-primary" : ""}
              >
                {opt}
              </Button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Input
            id="custom-interest"
            placeholder="Add custom fandom (e.g. VTubers, Webtoons)"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddCustom();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddCustom}
            disabled={loading}
          >
            Add
          </Button>
        </div>
      </div>
      <Button type="submit" disabled={disabled}>
        {loading ? "Saving..." : "Continue"}
      </Button>
    </form>
  );

  // Add custom interest handler
  function handleAddCustom() {
    const value = customInterest.trim();
    if (!value) return;
    const set = getSelectedSet();
    set.add(value);
    setFromArray(Array.from(set));
    setCustomInterest("");
  }
}