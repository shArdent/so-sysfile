import { useFileSystemContext } from "@/store/FileSystemContext";
import FolderTree from "./FolderTree";
import { PropsWithChildren, useEffect } from "react";

export default function FileSystemLayout({ children }: PropsWithChildren) {
  const { items } = useFileSystemContext();

  useEffect(() => {}, [items]);

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">My Drive</h2>
        <FolderTree folders={items} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-5">
        <h1 className="text-xl font-bold mb-2">Folder Content</h1>
        {children}
      </main>
    </div>
  );
}
