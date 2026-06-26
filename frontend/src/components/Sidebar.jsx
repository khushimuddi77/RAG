const docs = [
  "Employee Handbook",
  "Leave Policy",
  "Remote Work Policy",
  "Security Policy",
  "Travel Policy",
  "Benefits Guide",
  "Engineering Guidelines",
];

export default function Sidebar() {
  return (
    <div className="w-72 border-r border-gray-200 bg-white p-6">
      <h1 className="text-2xl font-bold">Therech AI</h1>

      <p className="text-sm text-gray-500 mt-1">
        Enterprise Knowledge Assistant
      </p>

      <div className="mt-10">
        <h2 className="text-xs font-semibold uppercase text-gray-400 mb-4">
          Knowledge Base
        </h2>

        <div className="space-y-3">
          {docs.map((doc) => (
            <div
              key={doc}
              className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3"
            >
              {doc}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}