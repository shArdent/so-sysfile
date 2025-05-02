import React, { createContext, useContext, useEffect, useState } from "react";
import { FileSystemItem } from "@/types";
import { v4 as uuidv4 } from "uuid";

const DB_NAME = "FileSystemDB";
const DB_VERSION = 1;
const STORE_NAME = "items";

// Open IndexedDB
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

// Context Type
interface FileSystemContextType {
  items: FileSystemItem[];
  currentFolderId: string;
  navigationStack: string[];
  setCurrentFolderId: (id: string) => void;
  addItem: (item: FileSystemItem) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => Promise<FileSystemItem | undefined>;
  fetchItems: (parentId?: string) => void;
  getBreadcrumbPath: (id: string) => Promise<FileSystemItem[]>;
  goBack: () => void;
  goToFolder: (id: string) => void;
}

// Create Context
const FileSystemContext = createContext<FileSystemContextType | null>(null);

// Provider
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
      return prev.slice(0, -1); // hapus item terakhir
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
    await store.put({ ...item, id: item.id ?? uuidv4() });
    await fetchItems();
  }

  async function deleteItem(id: string) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const index = store.index("parentId");
    const childrenRequest = index.getAll([id]);

    store.delete(id);

    childrenRequest.onsuccess = async () => {
      const children = childrenRequest.result as FileSystemItem[];
      for (const child of children) {
        if (child.type === "folder") {
          await deleteItem(child.id);
        } else {
          store.delete(child.id);
        }
      }
    };

    childrenRequest.onerror = () => {
      console.error("Failed to fetch children for deletion");
    };

    await fetchItems();
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

    // Optionally tambahkan root
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

  return (
    <FileSystemContext.Provider
      value={{
        items,
        currentFolderId,
        setCurrentFolderId,
        navigationStack,
        addItem,
        deleteItem,
        getItem,
        fetchItems,
        getBreadcrumbPath,
        goToFolder,
        goBack,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

// Hook untuk akses context
export const useFileSystemContext = () => {
  const context = useContext(FileSystemContext);
  if (!context)
    throw new Error(
      "useFileSystemContext must be used within FileSystemProvider",
    );
  return context;
};
