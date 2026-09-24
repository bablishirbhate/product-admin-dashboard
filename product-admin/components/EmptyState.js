export default function EmptyState({ message = "Nothing found.", action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line px-4 py-16 text-center text-sm text-ink/60">
      <p>{message}</p>
      {action}
    </div>
  );
}
