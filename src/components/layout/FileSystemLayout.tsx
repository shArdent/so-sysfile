import { useFileSystemContext } from "@/store/FileSystemContext";
import FolderTree from "./FolderTree";
import { PropsWithChildren } from "react";

export default function FileSystemLayout({ children }: PropsWithChildren) {
  const { items } = useFileSystemContext();

  return (
    <div className="flex h-full min-h-screen w-full">
      <aside className="w-64 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Folder Tree</h2>
        <FolderTree folders={items} />
      </aside>

      <main className="flex-1 px-8 py-4">
        <h1 className="text-xl font-bold mb-2">Konten</h1>
        {children}
      </main>
    </div>
  );
}
