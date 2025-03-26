import React, { createContext, useContext, useState, ReactNode } from "react";

/* Type Definitions */
interface GlobalContextType {
  driveSection: string;
  setDriveSection: (section: string) => void;
}

/* Default Context Values */
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

/* Provider Component */
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [driveSection, setDriveSection] = useState<string>("drive-home");

  return (
    <GlobalContext.Provider value={{ driveSection, setDriveSection }}>
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
