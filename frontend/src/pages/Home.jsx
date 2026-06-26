import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Home() {
  return (
    <div className="h-screen flex bg-[#FAFAFA]">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}