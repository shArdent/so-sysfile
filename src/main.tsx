import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FolderProvider } from "./store/FolderContext.tsx";
import { FileSystemProvider } from "./store/FileSystemContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FileSystemProvider>
      <FolderProvider>
        <App />
      </FolderProvider>
    </FileSystemProvider>
  </StrictMode>,
);
