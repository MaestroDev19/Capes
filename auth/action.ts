"use server";

import { createClient } from "../supabase/server";
import { redirect } from "next/navigation";

export async function signInWithTwitch() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "twitch",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error during sign-in:", error.message);
    redirect("/error");
  }

  if (data?.url) {
    redirect(data.url);
  }

  redirect("/error");
 
}

export async function signOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error during sign-out:", error.message);
    redirect("/error");
  }
  redirect("/login");
}