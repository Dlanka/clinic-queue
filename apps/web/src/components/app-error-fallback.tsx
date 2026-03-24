import { Button, Card } from "@/components/ui";

interface AppErrorFallbackProps {
  error?: unknown;
  reset?: () => void;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong while rendering this page.";
}

export function AppErrorFallback({ error, reset }: AppErrorFallbackProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-neutral-20 p-4 md:p-6">
      <Card className="w-full max-w-2xl">
        <Card.Body className="space-y-4 p-6 text-center">
          <h1 className="text-2xl font-bold text-neutral-99">Unexpected Error</h1>
          <p className="text-sm text-neutral-70">{getErrorMessage(error)}</p>
          <div className="flex justify-center gap-2">
            <Button startIconName="refreshCcw" onClick={() => (reset ? reset() : window.location.reload())}>
              Try Again
            </Button>
            <Button variant="outlined" intent="neutral" startIconName="home" onClick={() => window.location.assign("/")}>
              Go Home
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
