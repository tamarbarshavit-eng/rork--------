import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { Message, Settings, Chat } from '@/types';

const STORAGE_KEYS = {
  CHATS: 'chats',
  SETTINGS: 'settings',
  ONBOARDING_DONE: 'onboardingDone',
} as const;

const DEFAULT_SETTINGS: Settings = {
  quietMode: false,
  maxMessagesPerDay: 10,
  currentMessageCount: 0,
  lastResetDate: new Date().toDateString(),
};

const generateInviteCode = (): string => {
  return 'xxxx-xxxx-xxxx'.replace(/x/g, () => {
    return Math.floor(Math.random() * 16).toString(16).toUpperCase();
  });
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [onboardingDone, setOnboardingDone] = useState<boolean>(false);

  const chatsQuery = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CHATS);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
    },
  });

  const onboardingQuery = useQuery({
    queryKey: ['onboarding'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE);
      return stored === 'true';
    },
  });

  useEffect(() => {
    if (chatsQuery.data) setChats(chatsQuery.data);
  }, [chatsQuery.data]);

  useEffect(() => {
    if (settingsQuery.data) setSettings(settingsQuery.data);
  }, [settingsQuery.data]);

  useEffect(() => {
    if (onboardingQuery.data !== undefined) setOnboardingDone(onboardingQuery.data);
  }, [onboardingQuery.data]);

  const saveChatsMutation = useMutation({
    mutationFn: async (newChats: Chat[]) => {
      await AsyncStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(newChats));
      return newChats;
    },
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings: Settings) => {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      return newSettings;
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
      return true;
    },
  });

  const createChat = (partnerName: string): Chat => {
    const newChat: Chat = {
      id: Date.now().toString(),
      partnerName,
      inviteCode: generateInviteCode(),
      createdAt: Date.now(),
      messages: [],
    };

    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    saveChatsMutation.mutate(updatedChats);
    return newChat;
  };

  const joinChat = (inviteCode: string, myName: string): Chat | null => {
    const existingChat = chats.find(c => c.inviteCode.toUpperCase() === inviteCode.toUpperCase());
    if (existingChat) {
      return existingChat;
    }

    const newChat: Chat = {
      id: Date.now().toString(),
      partnerName: myName,
      inviteCode: inviteCode.toUpperCase(),
      createdAt: Date.now(),
      messages: [],
    };

    const updatedChats = [...chats, newChat];
    setChats(updatedChats);
    saveChatsMutation.mutate(updatedChats);
    return newChat;
  };

  const addMessage = (chatId: string, message: Message) => {
    const today = new Date().toDateString();
    let updatedSettings = { ...settings };
    
    if (settings.lastResetDate !== today) {
      updatedSettings = {
        ...settings,
        currentMessageCount: 1,
        lastResetDate: today,
      };
    } else {
      updatedSettings = {
        ...settings,
        currentMessageCount: settings.currentMessageCount + 1,
      };
    }

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, message],
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setSettings(updatedSettings);
    saveChatsMutation.mutate(updatedChats);
    saveSettingsMutation.mutate(updatedSettings);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettingsMutation.mutate(updated);
  };

  const completeOnboarding = () => {
    setOnboardingDone(true);
    completeOnboardingMutation.mutate();
  };

  const canSendMessage = (): { allowed: boolean; reason?: string } => {
    if (settings.quietMode) {
      return { allowed: false, reason: 'מצב שקט פעיל' };
    }

    const today = new Date().toDateString();
    const count = settings.lastResetDate === today ? settings.currentMessageCount : 0;

    if (count >= settings.maxMessagesPerDay) {
      return { allowed: false, reason: `הגעת למגבלת ${settings.maxMessagesPerDay} הודעות ליום` };
    }

    return { allowed: true };
  };

  const getChatById = (chatId: string): Chat | undefined => {
    return chats.find(chat => chat.id === chatId);
  };

  return {
    chats,
    settings,
    onboardingDone,
    createChat,
    joinChat,
    addMessage,
    updateSettings,
    completeOnboarding,
    canSendMessage,
    getChatById,
    isLoading: chatsQuery.isLoading || settingsQuery.isLoading || onboardingQuery.isLoading,
  };
});
