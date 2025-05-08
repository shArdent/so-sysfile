import "./App.css";
import FileSystemLayout from "./components/layout/FileSystemLayout";
import FolderCard from "./components/fragments/FolderCard";
import { useFileSystemContext } from "./store/FileSystemContext";
import { BreadcrumbFormat } from "./components/layout/BreadcrumbsFormat";
import NewFolderDialog from "./components/fragments/NewFolderDialog";
import { Button } from "./components/ui/button";
import NewFileDialog from "./components/fragments/NewFileDialog";
import { FileSystemItem } from "./types";
import FileCard from "./components/fragments/FileCard";

function App() {
  const { items, goBack, currentFolderId } = useFileSystemContext();

  return (
    <FileSystemLayout>
      <div className="flex justify-between flex-col gap-5">
        <BreadcrumbFormat />
        <div className="flex gap-5">
          <NewFolderDialog />
          <NewFileDialog />
          {currentFolderId !== "root" && (
            <Button variant={"outline"} onClick={goBack}>
              Go back
            </Button>
          )}{" "}
        </div>
      </div>
      <div className="w-full h-fit  flex  justify-center flex-wrap  gap-8 py-4">
        {items
          .filter((f) => f.parentId === currentFolderId)
          .sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
          })
          .map((item: FileSystemItem) => {
            if (item.type === "file")
              return <FileCard item={item} key={item.id} />;
            return <FolderCard item={item} key={item.id} />;
          })}
      </div>
    </FileSystemLayout>
  );
}

export default App;
