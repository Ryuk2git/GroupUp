import { createContext, useContext, useState, ReactNode } from "react";

interface User{
    name: string;
    profilePic: string;
    status?: string;
    role?: string;
}

interface ChatVoiceContextProps {
    selectChat: User | null;
    setSelectChat: (chat: User | null) => void;
    selectVoiceChannel: string | null;
    setSelectVoiceChannel: (channel: string | null) => void;
    selectUser: User | null;
    setSelectUser: (user: User | null) => void;
}

// Create the context
const ChatVoiceContext = createContext<ChatVoiceContextProps | undefined>(undefined);

// Custom hook to use ChatVoiceContext
export const useChatVoice = () => {
    const context = useContext(ChatVoiceContext);
    if (!context) {
      throw new Error("useChatVoice must be used within a ChatVoiceProvider");
    }
    return context;
};

// Provider Component
export const ChatVoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectChat, setSelectChat] = useState<User | null>(null);
  const [selectVoiceChannel, setSelectVoiceChannel] = useState<string | null>(null);
  const [selectUser, setSelectUser] = useState<User | null>(null);


  return (
    <ChatVoiceContext.Provider value={{ selectChat, setSelectChat, selectVoiceChannel, setSelectVoiceChannel, selectUser, setSelectUser }}>
      {children}
    </ChatVoiceContext.Provider>
  );
};

