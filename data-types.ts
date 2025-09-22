export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  fandoms: Fandom; // Consider defining a type for fandoms if structure is known
  interests: Interest; // Consider defining a type for interests if structure is known
  country: string;
  event_count: number;
  created_at: string; // ISO 8601 timestamp (timestamptz)
  updated_at: string; // ISO 8601 timestamp (timestamptz)
}

type Fandom = Record<string, string>;
type Interest = Record<string, string>;