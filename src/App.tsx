import "./App.css";
import FileSystemLayout from "./components/layout/FileSystemLayout";
import { FolderItemCard } from "./components/fragments/FolderCard";
import { useFileSystemContext } from "./store/FileSystemContext";
import { BreadcrumbFormat } from "./components/layout/BreadcrumbsFormat";
import NewFolderDialog from "./components/fragments/NewFolderDialog";
import { Button } from "./components/ui/button";

function App() {
  const { items, goToFolder, goBack, setCurrentFolderId, currentFolderId } =
    useFileSystemContext();

  return (
    <FileSystemLayout>
      <div className="flex justify-between flex-col gap-5">
        <BreadcrumbFormat />
        <div className="flex gap-5">
          <NewFolderDialog />
          {currentFolderId !== "root" && (
            <Button variant={"outline"} onClick={goBack}>
              Go back
            </Button>
          )}{" "}
        </div>
      </div>
      <div className="w-full h-fit  flex flex-wrap justify-between  gap-5 py-4">
        {items
          .filter((f) => f.parentId === currentFolderId)
          .map((folder) => (
            <FolderItemCard
              key={folder.id}
              id={folder.id}
              name={folder.name}
              onClick={() => {
                console.log(
                  "menuju folder " + folder.name + " dengan id " + folder.id,
                );
                goToFolder(folder.id);
                setCurrentFolderId(folder.id);
              }}
            />
          ))}
      </div>
    </FileSystemLayout>
  );
}

export default App;
