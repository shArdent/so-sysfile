import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import NewFileTextCard from "./NewFileTextCard";
import NewFileUploadCard from "./NewFileUploadCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";

const NewFileDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Tambah File</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah File Baru</DialogTitle>
          <DialogDescription>
            Tambahkan atau upload file ke direktori saat ini
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="create" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Buat</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <NewFileTextCard isOpen={isOpen} setIsOpen={setIsOpen} />
          </TabsContent>
          <TabsContent value="upload">
            <NewFileUploadCard setOpen={setIsOpen} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewFileDialog;
