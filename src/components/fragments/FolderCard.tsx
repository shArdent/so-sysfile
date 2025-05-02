import { FolderIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useFileSystemContext } from "@/store/FileSystemContext";

interface FolderItemCardProps {
  name: string;
  id: string;
  onClick?: () => void;
}

export function FolderItemCard({ name, onClick, id }: FolderItemCardProps) {
  const { deleteItem } = useFileSystemContext();
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onClick={onClick}
          className="relative w-32 h-24 border rounded-lg shadow-sm cursor-pointer p-3 flex flex-col items-center justify-center hover:bg-muted transition"
        >
          <FolderIcon className="w-6 h-6 text-yellow-500 mb-2" />
          <p className="text-sm text-center text-wrap truncate">{name}</p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteItem(id);
          }}
        >
          Delete Folder
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
