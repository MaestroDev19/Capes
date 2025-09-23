import { redirect } from "next/navigation";
import { createClient as createServerSupabase } from "@/supabase/server";
import { ensureProfileWithDefaults, isProfileComplete } from "@/lib/profile";
import { ProfileForm } from "./ui";

/**
 * CompleteProfilePage
 * Server component for the profile completion flow.
 * - Ensures user is authenticated.
 * - Ensures a profile exists with defaults.
 * - Redirects if already complete.
 * - Renders hero, progress, and the profile form.
 */
export default async function CompleteProfilePage() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect("/login");

  const profile = await ensureProfileWithDefaults(user.id);
  if (isProfileComplete(profile)) redirect("/");

  return (
    <div className="min-h-screen gradient-secondary flex items-center justify-center p-4">
      {/* Hero Section */}
      <div className="w-full max-w-2xl overflow-hidden">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-4 text-balance">Welcome to Capes!</h1>
          <p className="text-lg text-muted-foreground text-balance max-w-md mx-auto">
            Let&apos;s set up your profile so you can connect with fellow fans and discover amazing content.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <span className="text-sm font-medium text-white">1</span>
            </div>
            <div className="w-16 h-1 bg-primary/20 rounded-full">
              <div className="w-full h-full gradient-primary rounded-full"></div>
            </div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">2</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-4 sm:p-8 overflow-hidden">
          <ProfileFormServerShell userId={user.id} />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">Step 1 of 2 • This will only take a minute</p>
        </div>
      </div>
    </div>
  );
}

/**
 * ProfileFormServerShell
 * Server wrapper for the client ProfileForm.
 * Keeps server route for gating, but uses client supabase for form.
 */
function ProfileFormServerShell({ userId }: { userId: string }) {
  return <ProfileForm userId={userId} />;
}
