const suggestions = [
  "How many sick leaves do employees get?",
  "What is the remote work policy?",
  "What are the password requirements?",
  "How do I claim travel expenses?",
];

export default function SuggestedQuestions({ onSelect }) {
  return (
    <div className="grid gap-3 mb-6">
      {suggestions.map((question) => (
        <button
          key={question}
          onClick={() => onSelect(question)}
          className="text-left p-4 bg-white border rounded-xl hover:bg-gray-50"
        >
          {question}
        </button>
      ))}
    </div>
  );
}