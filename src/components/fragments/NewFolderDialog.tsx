import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFileSystemContext } from "@/store/FileSystemContext";
import { FileSystemItem } from "@/types";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export default function NewFolderDialog() {
  const [newName, setNewName] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { addItem, currentFolderId } = useFileSystemContext();

  useEffect(() => {
    if (isOpen) setNewName("");
  }, [isOpen]);

  const handleSubmit = () => {
    const id = uuid();
    const payload: FileSystemItem = {
      id,
      name: newName,
      type: "folder",
      parentId: currentFolderId as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addItem(payload);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          Tambah Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat Folder Baru</DialogTitle>
          <DialogDescription>
            Menambahkan folder baru di direktori saat ini
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="name" className="text-right">
            Nama Folder
          </Label>
          <Input
            id="name"
            onChange={(e) => setNewName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} type="submit">
            Buat Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
