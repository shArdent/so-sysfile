import { FolderIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { useFileSystemContext } from "@/store/FileSystemContext";
import { FileSystemItem } from "@/types";
import { Card, CardContent } from "../ui/card";

export default function FolderCard({ item }: { item: FileSystemItem }) {
  const { deleteItem, setCurrentFolderId, goToFolder } = useFileSystemContext();
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          onClick={() => {
            goToFolder(item.id);
            setCurrentFolderId(item.id);
          }}
          className="w-36 h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition"
        >
          <CardContent className="flex flex-col items-center gap-2">
            <FolderIcon className="w-6 h-6 text-yellow-500 mb-2" />
            <p className="text-sm">{item.name}</p>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={(e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteItem(item.id);
          }}
        >
          Delete Folder
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
