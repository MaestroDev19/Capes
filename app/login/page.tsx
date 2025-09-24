import { signInWithTwitch } from "../auth/action";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Continue with your Twitch account
        </p>
        <div>
          <form action={signInWithTwitch}>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Continue with Twitch"
            >
              {/* Simple text; replace with Twitch icon if desired */}
              Continue with Twitch
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}


