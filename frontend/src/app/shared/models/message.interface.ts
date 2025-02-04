export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: number;
  participants: {
    id: number;
    username: string;
    avatar: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}
