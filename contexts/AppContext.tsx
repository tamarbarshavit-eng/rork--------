import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, push, set, serverTimestamp, get } from 'firebase/database';
import Firebase from '../firebase';
import type { UserChat, Message, Settings } from '@/types';

export type User = {
  uid: string;
  email: string;
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [loading,setLoading] = useState(true)
  const [loggedin, setLoggedIn] = useState(false);
  const [chats, setChats] = useState<UserChat[]>([]); // ✅ IMPORTANT
  const [settings, setSettings] = useState<Settings>({
    quietMode: false,
    maxMessagesPerDay: 10,
    currentMessageCount: 0,
    lastResetDate: new Date().toDateString(),
  });

  // 🔐 Auth
  useEffect(() => {
    return onAuthStateChanged(Firebase.auth, (a) => {
      setLoading(false)
      if (!a) {
        setUser(null);
        setLoggedIn(false);
        return;
      }

      setUser({ uid: a.uid, email: a.email ?? '' });
      setLoggedIn(true);
    });
  }, []);

  // 💬 Listen ONLY to userChats (what Chats screen needs)
  useEffect(() => {
    if (!user) return;

    const userChatsRef = ref(Firebase.db, `userChats/${user.uid}`);

    return onValue(userChatsRef, (snap) => {
      const data = snap.val();
      if (!data) {
        setChats([]);
        return;
      }

      const list: UserChat[] = Object.values(data);
      setChats(list);
    });
  }, [user]);

  // 🆕 Join chat by UID
  const joinChat = async (partnerUid: string) => {
    if (!user) throw new Error('Not logged in');

    const chatId = [user.uid, partnerUid].sort().join('_');

    // check if chat exists
    const chatSnap = await get(ref(Firebase.db, `chats/${chatId}`));
    if (!chatSnap.exists()) {
      await set(ref(Firebase.db, `chats/${chatId}`), {
        id: chatId,
        members: {
          [user.uid]: true,
          [partnerUid]: true,
        },
        createdAt: Date.now(),
      });
    }

    const userChat: UserChat = {
      chatId,
      partnerUid,
      updatedAt: Date.now(),
    };

    const partnerUserChat: UserChat = {
      chatId,
      partnerUid: user.uid,
      updatedAt: Date.now(),
    };

    await set(ref(Firebase.db, `userChats/${user.uid}/${chatId}`), userChat);
    await set(ref(Firebase.db, `userChats/${partnerUid}/${chatId}`), partnerUserChat);
  };

  // ✉️ Send message
  const sendMessage = async (chatId: string, message: Message) => {
    if (!user) return;

    const msgRef = push(ref(Firebase.db, `messages/${chatId}`));

    await set(msgRef, {
      ...message,
      senderUid: user.uid,
      timestamp: serverTimestamp(),
    });

    // update both users' chat previews
    const chatRef = ref(Firebase.db, `chats/${chatId}`);
    await set(ref(Firebase.db, `chats/${chatId}/lastMessage`), {
      text: message.filteredText,
      timestamp: Date.now(),
    });

    const chat = chatId.split('_');
    const uid1 = chat[0];
    const uid2 = chat[1];

    await set(ref(Firebase.db, `userChats/${uid1}/${chatId}/lastMessage`), message.filteredText);
    await set(ref(Firebase.db, `userChats/${uid2}/${chatId}/lastMessage`), message.filteredText);
  };

  const getChatById = (chatId: string) =>
    chats.find((c) => c.chatId === chatId);

  return {
    user,
    loggedin,
    loading,
    setUser,
    setLoggedIn,
    chats,
    joinChat,
    sendMessage,
    getChatById,
    settings,
  };
});
