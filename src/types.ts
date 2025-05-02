export interface FileSystemItem {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: IDBValidKey;
  data?: Blob;
  createdAt: Date;
  updatedAt: Date;
}
