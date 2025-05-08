import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { FileSystemItem } from "@/types";
import { useFileSystemContext } from "@/store/FileSystemContext";

const InnerFileDialog = ({
  item,
  isOpen,
  setIsOpen,
}: {
  item: FileSystemItem;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const { fetchItems, editItem, getItem } = useFileSystemContext();
  const [fileContent, setFileContent] = useState(item.data);

  const handleEdit = () => {
    editItem(item.id, fileContent as string);
    fetchItems();
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        const updatedItem = await getItem(item.id);
        if (updatedItem && typeof updatedItem.data === "string") {
          setFileContent(updatedItem.data);
        } else {
          setFileContent("");
        }
      }
    };
    fetchData();
  }, [isOpen, item.id]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[400px]">
        <DialogHeader>
          <DialogTitle>Notepad - test file</DialogTitle>
        </DialogHeader>
        <textarea
          className="w-full h-64 p-2 border rounded-sm resize-none"
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleEdit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InnerFileDialog;
