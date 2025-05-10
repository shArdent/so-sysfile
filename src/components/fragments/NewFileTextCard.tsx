import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { v4 as uuid } from "uuid";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useFileSystemContext } from "@/store/FileSystemContext";
import { FileSystemItem } from "@/types";

const NewFileTextCard = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  const [newName, setNewName] = useState<string>("");
  const [newData, setNewData] = useState<string>("");
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
    <Card>
      <CardHeader>
        <CardTitle>Buat File Baru</CardTitle>
        <CardDescription>
          Menambahkan file baru di direktori saat ini
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="font-semibold">
            Nama File
          </Label>
          <Input
            id="name"
            onChange={(e) => setNewName(e.target.value)}
            className="col-span-3"
          />
          <Label htmlFor="name" className="font-semibold">
            Isi File
          </Label>
          <textarea
            className="w-full h-42 p-2 border rounded-sm resize-none"
            onChange={(e) => setNewData(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} type="submit">
          Buat File
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewFileTextCard;
