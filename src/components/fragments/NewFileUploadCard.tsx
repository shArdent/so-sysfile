import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useFileSystemContext } from "@/store/FileSystemContext";
import { v4 as uuid } from "uuid";
import { FileSystemItem } from "@/types";
import FileUploader from "./FileUploader";
import { toast } from "sonner";

const NewFileUploadCard = ({
  setOpen,
}: {
  setOpen: (val: boolean) => void;
}) => {
  const { addItem, currentFolderId } = useFileSystemContext();
  const [fileData, setFileData] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!fileData) {
      toast.error("Belum ada file dipilih");
      return;
    }
    const id = uuid();
    const payload: FileSystemItem = {
      id,
      name: fileData.name,
      type: "file",
      contentType: fileData.type,
      data: fileData,
      parentId: currentFolderId as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addItem(payload);
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload File Baru</CardTitle>
        <CardDescription>Menambahkan file dari perangkat anda</CardDescription>
      </CardHeader>
      <CardContent>
        <FileUploader onFileUpload={setFileData} />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} type="submit">
          Tambahkan File
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewFileUploadCard;
