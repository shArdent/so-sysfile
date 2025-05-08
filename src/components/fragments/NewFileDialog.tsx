import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { v4 as uuid } from "uuid";
import { useFileSystemContext } from "@/store/FileSystemContext";
import { FileSystemItem } from "@/types";

const NewFileDialog = () => {
  const [newName, setNewName] = useState<string>("");
  const [newData, setNewData] = useState<string>("");
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
      type: "file",
      data: newData,
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
          Tambah File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat File Baru</DialogTitle>
          <DialogDescription>
            Menambahkan file baru di direktori saat ini
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Label htmlFor="name" className="text-right">
            Nama File
          </Label>
          <Input
            id="name"
            onChange={(e) => setNewName(e.target.value)}
            className="col-span-3"
          />
          <Label htmlFor="name" className="text-right">
            Isi File
          </Label>
          <textarea
            className="w-full h-64 p-2 border rounded-sm resize-none"
            onChange={(e) => setNewData(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} type="submit">
            Buat File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewFileDialog;
