import React, { createContext, useContext, useEffect, useState } from "react";
import { FileSystemItem } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { promisifyRequest } from "@/lib/utils";

const DB_NAME = "FileSystemDB";
const DB_VERSION = 1;
const STORE_NAME = "items";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("parentId", ["parentId"], { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

interface FileSystemContextType {
  items: FileSystemItem[];
  currentFolderId: string;
  navigationStack: string[];
  setCurrentFolderId: (id: string) => void;
  addItem: (item: FileSystemItem) => void;
  editItem: (id: string, newData: any) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => Promise<FileSystemItem | undefined>;
  fetchItems: (parentId?: string) => void;
  getBreadcrumbPath: (id: string) => Promise<FileSystemItem[]>;
  goBack: () => void;
  goToFolder: (id: string) => void;
  fetchItemsByParentId: (id: string) => void;
  moveItem: (id: string, newParentId: string) => void;
  uploadFile: (file: File, paretnId: string) => void;
}

const FileSystemContext = createContext<FileSystemContextType | null>(null);

export const FileSystemProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string>("root");
  const [navigationStack, setNavigationStack] = useState<string[]>(["root"]);

  useEffect(() => {
    fetchItems();
  }, [currentFolderId, navigationStack]);

  async function fetchItemsByParentId(parentId: string = "root") {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("parentId");
    const request = index.getAll(parentId);
    request.onsuccess = () => {
      setItems(request.result as FileSystemItem[]);
    };
  }

  const goBack = () => {
    setNavigationStack((prev) => {
      if (prev.length === 1) return prev;
      const last = prev[prev.length - 2];
      setCurrentFolderId(last);
      return prev.slice(0, -1);
    });
  };

  const goToFolder = (id: string) => {
    setNavigationStack((prev) => [...prev, id]);
    setCurrentFolderId(id);
  };

  async function fetchItems() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const index = store.getAll();
    index.onsuccess = () => {
      setItems(index.result as FileSystemItem[]);
    };
  }

  async function addItem(item: FileSystemItem) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put({ ...item, id: item.id ?? uuidv4() });
    await fetchItems();
  }

  async function editItem(id: string, value: any) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const getReq = store.get(id);
    getReq.onsuccess = async () => {
      const item = getReq.result as FileSystemItem;
      if (!item) {
        console.error("Item not found for editing:", id);
        return;
      }

      const updatedItem = {
        ...item,
        data: value,
        updatedAt: new Date(),
      };

      store.put(updatedItem);
      await fetchItems();
    };

    getReq.onerror = () => {
      console.error("Failed to retrieve item for editing");
    };
  }

  async function deleteItem(id: string) {
    const db = await openDB();
    const readTx = db.transaction(STORE_NAME, "readonly");
    const index = readTx.objectStore(STORE_NAME).index("parentId");
    const children = await promisifyRequest<FileSystemItem[]>(index.getAll(id));
    for (const child of children) {
      await deleteItem(child.id);
    }

    const writeTx = db.transaction(STORE_NAME, "readwrite");
    const store = writeTx.objectStore(STORE_NAME);
    await promisifyRequest(store.delete(id));

    await fetchItems();
  }

  async function moveItem(id: string, newParentId: string) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = async () => {
      const item = request.result as FileSystemItem;
      if (item) {
        item.parentId = newParentId;
        item.updatedAt = new Date();
        store.put(item);
        await fetchItems();
      }
    };
  }

  async function getItem(id: string): Promise<FileSystemItem | undefined> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result as FileSystemItem);
    });
  }

  async function getBreadcrumbPath(id: string): Promise<FileSystemItem[]> {
    const path: FileSystemItem[] = [];

    let currentId = id;
    while (currentId && currentId !== "root") {
      const item = await getItem(currentId);
      if (!item) break;
      path.unshift(item); // prepend
      currentId = (item.parentId as string) || "root";
    }

    path.unshift({
      id: "root",
      name: "Home",
      type: "folder",
      parentId: "root",
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    return path;
  }

  async function uploadFile(file: File, parentId: string = "root") {
    const db = await openDB();

    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    const fileData = {
      id: uuidv4(),
      name: file.name,
      type: "file",
      data: file,
      parentId: parentId,
      contentType: file.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies FileSystemItem;

    store.add(fileData);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve(fileData);
      tx.onerror = () => reject(tx.error);
    });
  }

  return (
    <FileSystemContext.Provider
      value={{
        items,
        currentFolderId,
        setCurrentFolderId,
        navigationStack,
        addItem,
        editItem,
        deleteItem,
        getItem,
        fetchItems,
        getBreadcrumbPath,
        goToFolder,
        goBack,
        fetchItemsByParentId,
        moveItem,
        uploadFile,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystemContext = () => {
  const context = useContext(FileSystemContext);
  if (!context)
    throw new Error(
      "useFileSystemContext must be used within FileSystemProvider",
    );
  return context;
};
