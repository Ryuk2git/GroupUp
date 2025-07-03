import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  userId: string;
  chatId: string;
  friendId: string;
  username: string;
  email: string;
  pfp: string;
}

export interface IEvent {
  memberUserNames: any;
  createdByUserName: ReactNode;
  eventId: string;
  title: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate: Date;
  category: 'work' | 'personal' | 'shared';
  createdBy: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IGroupChannel {
  id: string;
  name: string;
  groupId?: string;
  groupName?: string;
  groupDescription?: string;
  created_by?: string;
  created_at?: string;
  chatId: string; 
  members?: Array<{
    userId: string;
    username: string;
    is_admin: boolean;
    joined_at: string;
    profile_pic?: string | null;
  }>;
}

/* Type Definitions */
interface GlobalContextType {
  driveSection: string;
  setDriveSection: (section: string) => void;
  selectedChat: User | null;
  setSelectedChat: (user: User | null) => void;
  events: IEvent[];
  setEvents: (events: IEvent[]) => void;
  selectedEvent: IEvent | null;
  setSelectedEvent: (event: IEvent | null) => void;
  selectedGroup: IGroupChannel | null; 
  setSelectedGroup: (group: IGroupChannel | null) => void; 
}

/* Default Context Values */
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

/* Provider Component */
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [driveSection, setDriveSection] = useState<string>("drive-home");
  const [selectedChat, setSelectedChat] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<IGroupChannel | null>(null);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  return (
    <GlobalContext.Provider value={{
      driveSection,
      setDriveSection,
      selectedChat,
      setSelectedChat,
      selectedGroup,
      setSelectedGroup,
      events,
      setEvents,
      selectedEvent,
      setSelectedEvent
    }}>
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
