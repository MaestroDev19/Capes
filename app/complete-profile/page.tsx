import { redirect } from "next/navigation";
import { createClient as createServerSupabase } from "@/supabase/server";
import { ensureProfileWithDefaults, isProfileComplete } from "@/lib/profile";
import { ProfileForm } from "./ui";

export default async function CompleteProfilePage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");

  const profile = await ensureProfileWithDefaults(user.id);
  if (isProfileComplete(profile)) redirect("/");

  return (
    <div className="mx-auto max-w-md py-10">
      <h1 className="text-2xl font-semibold mb-6">Complete your profile</h1>
      {/* Client form mounts here to edit username, interests, country */}
      <ProfileFormServerShell userId={user.id} />
    </div>
  );
}

function ProfileFormServerShell({ userId }: { userId: string }) {
  // Render a client component that uses browser supabase to reduce roundtrips
  // while keeping server route for initial gating and defaults.
  return <ProfileForm userId={userId} />;
}

// Mark client component inline to avoid separate file overhead



