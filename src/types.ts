export interface FileSystemItem {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: IDBValidKey;
  data?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderNode {
  id: string;
  name: string;
  children: FolderNode[];
}
