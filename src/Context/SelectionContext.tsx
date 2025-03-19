import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SelectionType = "direct-message" | "calendar" | "tasks" | "emails" | "files" | "projects";

interface SelectedItem {
  type: SelectionType;
  data: any;
}

interface ContextPanelContextProps {
  selectedItem: SelectedItem | null;
  setSelectedItem: (item: SelectedItem | null) => void;
}

const SelectionContext = createContext<ContextPanelContextProps | undefined>(undefined);

export const useSelectionContext = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelectionContext must be used within a Provider.");
  }
  return context;
};

export const SelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  useEffect(() => {
    const storedSelection = sessionStorage.getItem("activeSelection");
    if (storedSelection) {
      const type: SelectionType = JSON.parse(storedSelection);
      setSelectedItem((prev) => (prev ? { ...prev, type } : { type, data: null }));
    }
  }, []);

  return (
    <SelectionContext.Provider value={{ selectedItem, setSelectedItem }}>
      {children}
    </SelectionContext.Provider>
  );
};