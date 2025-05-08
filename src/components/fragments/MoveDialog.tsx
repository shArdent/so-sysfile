import { useFileSystemContext } from "@/store/FileSystemContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { FileSystemItem, FolderNode } from "@/types";
import FolderTreeItem from "../ui/FolderTreeItem";

function buildFolderTree(
  items: FileSystemItem[],
  parentId: string = "root",
): FolderNode[] {
  return items
    .filter((item) => item.type === "folder" && item.parentId === parentId)
    .map((folder) => ({
      id: folder.id,
      name: folder.name,
      children: buildFolderTree(items, folder.id),
    }));
}

const MoveDialog = ({
  itemId,
  isOpen,
  setIsOpen,
}: {
  itemId: string;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const { items, moveItem } = useFileSystemContext();
  const folders = items.filter((i) => i.type === "folder");

  const folderTree = buildFolderTree(folders);

  const handleMove = (folderId: string) => {
    moveItem(itemId, folderId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[400px]">
        <DialogHeader>
          <DialogTitle>Move Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-1">
          {folderTree.map((node) => (
            <FolderTreeItem key={node.id} node={node} onSelect={handleMove} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDialog;
