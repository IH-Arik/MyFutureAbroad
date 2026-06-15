import ChatAreaContent from "./ChatAreaContent";

export function ChatArea(props: { activeThread: any; user: any; profile: any; onClose: () => void }) {
  return <ChatAreaContent {...props} />;
}

export default ChatArea;
