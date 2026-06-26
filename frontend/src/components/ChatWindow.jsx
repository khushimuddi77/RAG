import { useState } from "react";
import Message from "./Message";
import Sources from "./Sources";
import SuggestedQuestions from "./SuggestedQuestions";

export default function ChatWindow() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const askQuestion = async (q) => {
    const query = q || question;

    if (!query.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: query,
      },
    ]);

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
    }

    setQuestion("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-auto p-8">
        {messages.length === 0 && (
          <SuggestedQuestions onSelect={askQuestion} />
        )}

        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index}>
              <Message role={msg.role} text={msg.text} />
              <Sources sources={msg.sources} />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t bg-white p-6">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Therech AI..."
            className="flex-1 border rounded-xl px-4 py-3 outline-none"
            onKeyDown={(e) =>
              e.key === "Enter" && askQuestion()
            }
          />

          <button
            onClick={() => askQuestion()}
            className="px-6 py-3 bg-black text-white rounded-xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}