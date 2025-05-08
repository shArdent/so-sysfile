import { FileSystemItem } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { format } from "date-fns";
import { Separator } from "../ui/separator";

const PropertiesDialog = ({
  item,
  isOpen,
  setIsOpen,
}: {
  item: FileSystemItem;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[400px]">
        <DialogHeader>
          <DialogTitle>Properti - test file</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nama</span>
            <span>{item.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Tipe</span>
            <span>{item.type === "folder" ? "Folder" : "File"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">ID</span>
            <span>{item.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Parent ID</span>
            <span>{String(item.parentId)}</span>
          </div>

          {!item.data && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ukuran</span>
              <span>{new Blob([item.data]).size} bytes</span>
            </div>
          )}

          {item.data && typeof item.data === "string" && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ukuran</span>
              <span>{new Blob([item.data]).size} bytes</span>
            </div>
          )}

          {item.data instanceof Blob && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ukuran</span>
              <span>{item.data.size} bytes</span>
            </div>
          )}

          <Separator className="my-2" />

          <div className="flex justify-between">
            <span className="text-muted-foreground">Dibuat</span>
            <span>{format(new Date(item.createdAt), "dd MMM yyyy HH:mm")}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Terakhir Diperbarui</span>
            <span>{format(new Date(item.updatedAt), "dd MMM yyyy HH:mm")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertiesDialog;
