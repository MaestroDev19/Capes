"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/supabase/client";
import { type Profile } from "@/data-types";

type ProfileContextValue = {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
  refresh: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const { data: userResult } = await supabase.auth.getUser();
      const user = userResult.user;
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!isMounted) return;
      setProfile((data as Profile) ?? null);
    })();
    return () => {
      isMounted = false;
    };
  }, [supabase]);

  async function refresh() {
    const { data: userResult } = await supabase.auth.getUser();
    const user = userResult.user;
    if (!user) return;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile((data as Profile) ?? null);
  }

  return (
    <ProfileContext.Provider value={{ profile, setProfile, refresh }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfileContext must be used within ProfileProvider");
  return ctx;
}


