"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  //global-error.js must define its own <html> and <body> tags.
  //that is 'cause its fallback component replaces the root layout when active
  return (
    <html>
      <body>
        <div className="flex flex-col text-center justify-center py-44 gap-y-14 items-center">
          <h2>Something went wrong!</h2>
          <button
            className="btn bg-brand w-auto text-light transition-effect hover:bg-hover"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
