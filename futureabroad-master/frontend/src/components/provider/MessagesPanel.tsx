import MessagesPanelContent from "./MessagesPanelContent";

export function MessagesPanel(props: { providerId: string; userId: string }) {
  return <MessagesPanelContent {...props} />;
}

export default MessagesPanel;
