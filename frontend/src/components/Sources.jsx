export default function Sources({ sources }) {
  if (!sources?.length) return null;

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Sources</h3>

      <div className="space-y-2">
        {sources.map((source, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-lg text-sm border"
          >
            {source}
          </div>
        ))}
      </div>
    </div>
  );
}