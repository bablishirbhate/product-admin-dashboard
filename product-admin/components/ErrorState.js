export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-warn/30 bg-warn/5 px-4 py-12 text-center">
      <p className="text-sm text-warn">{message || "Something went wrong."}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md border border-warn/40 px-4 py-1.5 text-sm font-medium text-warn hover:bg-warn/10"
        >
          Retry
        </button>
      )}
    </div>
  );
}
