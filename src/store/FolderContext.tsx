// FolderContext.tsx
import { createContext, useContext, useState } from "react";

const FolderContext = createContext<{
  currentFolderId: string | null;
  setCurrentFolderId: (id: string) => void;
} | null>(null);

export const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentFolderId, setCurrentFolderId] = useState<string>("root"); // Root folder ID

  return (
    <FolderContext.Provider value={{ currentFolderId, setCurrentFolderId }}>
      {children}
    </FolderContext.Provider>
  );
};

export const useFolder = () => {
  const ctx = useContext(FolderContext);
  if (!ctx) throw new Error("useFolder must be used within FolderProvider");
  return ctx;
};
