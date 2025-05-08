import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FileSystemProvider } from "./store/FileSystemContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FileSystemProvider>
      <App />
    </FileSystemProvider>
  </StrictMode>,
);
