// ============================
// USERS  (/users/{uid})
// ============================
export interface User {
  uid: string;
  email: string;
  name?: string;
}



// ==================================
// MESSAGE  (/messages/{chatId}/{id})
// ==================================
export interface Message {
  id: string;

  // who sent it
  senderUid: string;

  // before respectful filter
  originalText: string;

  // after respectful filter
  filteredText: string;

  wasFiltered: boolean;

  timestamp: number;
}



// ==============================
// CHAT CORE  (/chats/{chatId})
// ==============================
export interface Chat {
  id: string;

  // both participants in chat
  members: {
    [uid: string]: true;
  };

  createdAt: number;

  // used for chat preview screen
  lastMessage?: {
    text: string;
    timestamp: number;
  };
}



// ===================================================
// USER CHAT INDEX  (/userChats/{uid}/{chatId})
// This is what the Chats screen actually renders
// ===================================================
export interface UserChat {
  chatId: string;

  // the other participant
  partnerUid: string;

  partnerName?: string;

  // preview text
  lastMessage?: string;

  updatedAt: number;
}



// =====================================
// USER SETTINGS  (/settings/{uid})
// =====================================
export interface Settings {
  quietMode: boolean;
  maxMessagesPerDay: number;
  currentMessageCount: number;
  lastResetDate: string;
}



// ==============================
// OPTIONAL: UI helper type
// ==============================
export interface ChatWithMessages extends Chat {
  messages: Message[];
}
