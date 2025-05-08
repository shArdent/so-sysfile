import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { FileIcon } from "lucide-react";
import { FileSystemItem } from "@/types";
import { useFileSystemContext } from "@/store/FileSystemContext";
import PropertiesDialog from "./PropertiesDialog";
import InnerFileDialog from "./InnerFileDialog";
import MoveDialog from "./MoveDialog";

const FileCard = ({ item }: { item: FileSystemItem }) => {
  const { deleteItem, editItem } = useFileSystemContext();
  const [isInnerFileOpen, setIsInnerFileOpen] = useState(false);
  const [isPropertyOpen, setIsPropertyOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteItem(item.id);
  };
  const handleTruncate = () => {
    editItem(item.id, "");
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            onClick={() => setIsInnerFileOpen(true)}
            className="w-36 h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition"
          >
            <CardContent className="flex flex-col items-center gap-2">
              <FileIcon className="w-6 h-6 text-blue-300 mb-2" />
              <p className="text-sm">{item.name}</p>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setIsPropertyOpen(true)}>
            Property
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setIsMoveDialogOpen(true)}>
            Move to..
          </ContextMenuItem>
          <ContextMenuItem onClick={handleTruncate}>
            Truncate File
          </ContextMenuItem>
          <ContextMenuItem onClick={handleDelete}>Delete File</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <InnerFileDialog
        isOpen={isInnerFileOpen}
        item={item}
        setIsOpen={setIsInnerFileOpen}
      />

      <PropertiesDialog
        item={item}
        isOpen={isPropertyOpen}
        setIsOpen={setIsPropertyOpen}
      />

      <MoveDialog
        itemId={item.id}
        isOpen={isMoveDialogOpen}
        setIsOpen={setIsMoveDialogOpen}
      />
    </>
  );
};

export default FileCard;
