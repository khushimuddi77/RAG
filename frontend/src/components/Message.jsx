export default function Message({ role, text }) {
  const isUser = role === "user";

  return (
    <div
      className={`max-w-3xl rounded-2xl p-4 ${
        isUser
          ? "ml-auto bg-black text-white"
          : "bg-white border border-gray-200"
      }`}
    >
      {text}
    </div>
  );
}