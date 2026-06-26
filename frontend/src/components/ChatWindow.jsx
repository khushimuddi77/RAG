import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import Sources from "./Sources";
import SuggestedQuestions from "./SuggestedQuestions";

export default function ChatWindow() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const askQuestion = async (q) => {
    const query = (q || question).trim();

    if (!query) return;

    // Clear textbox immediately
    setQuestion("");

    // Show user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: query,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: query,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
          sources: data.sources || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Unable to connect to backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">

      {/* Chat Area */}
      <div className="flex-1 overflow-auto p-8">

        {messages.length === 0 && !loading && (
          <SuggestedQuestions onSelect={askQuestion} />
        )}

        <div className="space-y-6">

          {messages.map((msg, index) => (
            <div key={index}>
              <Message role={msg.role} text={msg.text} />
              <Sources sources={msg.sources} />
            </div>
          ))}

          {loading && (
            <div className="bg-white border rounded-2xl p-4 w-fit shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                <span className="text-gray-600">
                  Searching company documents...
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-white p-6">
        <div className="max-w-4xl mx-auto flex gap-3">

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Therech AI..."
            className="flex-1 border rounded-xl px-4 py-3 outline-none"
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askQuestion();
              }
            }}
          />

          <button
            onClick={() => askQuestion()}
            disabled={loading}
            className="px-6 py-3 bg-black text-white rounded-xl disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>

        </div>
      </div>
    </div>
  );
}