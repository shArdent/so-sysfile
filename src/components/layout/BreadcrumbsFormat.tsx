import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import { useFileSystemContext } from "@/store/FileSystemContext";
import { FileSystemItem } from "@/types";

export function BreadcrumbFormat() {
  const [currentPath, setCurrentPath] = useState<FileSystemItem[]>([]);
  const {
    currentFolderId,
    getBreadcrumbPath,
    navigationStack,
    setCurrentFolderId,
  } = useFileSystemContext();

  const getPath = async () => {
    const path = await getBreadcrumbPath(currentFolderId);
    setCurrentPath(path);
  };

  useEffect(() => {
    getPath();
  }, [navigationStack, currentFolderId]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>Path:</BreadcrumbItem>
        {currentPath.map((path) => (
          <div className="flex gap-2 items-center justify-center" key={path.id}>
            <BreadcrumbItem>
              <BreadcrumbLink
                className={"cursor-pointer"}
                onClick={() => setCurrentFolderId(path.id)}
              >
                {path.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
