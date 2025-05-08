import { useState } from "react";
import { File, Folder } from "lucide-react";
import { cn } from "@/lib/utils"; // helper untuk classnames
import { FileSystemItem } from "@/types";
import { useFileSystemContext } from "@/store/FileSystemContext";

export default function FolderTree({
  folders,
  parentId = "root",
}: {
  folders: FileSystemItem[];
  parentId?: string | null;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const { currentFolderId } = useFileSystemContext();

  const toggle = (id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const children = folders.filter((f) => f.parentId === parentId);

  return (
    <ul className="ml-2 space-y-1 border-l border-gray-300 pl-2">
      {children.map((folder) => {
        const hasChild = folders.some((f) => f.parentId === folder.id);
        return (
          <li key={folder.id}>
            <div
              className={cn(
                "flex items-center gap-1 cursor-pointer hover:bg-muted p-1 rounded-md relative",
                currentFolderId == folder.id && "bg-gray-200",
              )}
              onClick={() => hasChild && toggle(folder.id)}
            >
              {/* Optional: dot or connector */}
              <span className="absolute -left-2 top-1/2 w-2 h-0.5 bg-gray-300" />
              {folder.type === "folder" ? (
                <Folder className="w-4 h-4" />
              ) : (
                <File className="w-4 h-4" />
              )}

              <span>{folder.name}</span>
            </div>
            {hasChild && open[folder.id] && (
              <FolderTree folders={folders} parentId={folder.id} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
