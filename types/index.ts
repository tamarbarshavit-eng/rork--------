export interface Message {
  id: string;
  text: string;
  filteredText: string;
  isFromMe: boolean;
  timestamp: number;
  wasFiltered: boolean;
}

export interface Settings {
  quietMode: boolean;
  maxMessagesPerDay: number;
  currentMessageCount: number;
  lastResetDate: string;
}

export interface Chat {
  id: string;
  partnerName: string;
  inviteCode: string;
  createdAt: number;
  messages: Message[];
}

export interface Partner {
  name: string;
  connected: boolean;
  inviteCode?: string;
}
