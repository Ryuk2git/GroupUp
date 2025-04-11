import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  chatId: string;
  friendId: string;
  username: string;
  email: string;
  pfp: string;
}

/* Type Definitions */
interface GlobalContextType {
  driveSection: string;
  setDriveSection: (section: string) => void;
  selectedChat: User | null;
  setSelectedChat: (user: User | null) => void;
}

/* Default Context Values */
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

/* Provider Component */
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [driveSection, setDriveSection] = useState<string>("drive-home");
  const [selectedChat, setSelectedChat] = useState<User | null>(null);

  return (
    <GlobalContext.Provider value={{ driveSection, setDriveSection, selectedChat, setSelectedChat }}>
      {children}
    </GlobalContext.Provider>
  );
};

/* Custom Hook for Using Context */
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
