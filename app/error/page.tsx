export default function ErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-semibold text-destructive">Authentication Error</h1>
        <p className="text-sm text-muted-foreground">
          There was an error during authentication. Please try again.
        </p>
        <div>
          <a
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium shadow hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Try Again
          </a>
        </div>
      </div>
    </main>
  );
}
