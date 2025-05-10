import { useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { XIcon } from "lucide-react";

interface FileDropUploaderProps {
  onFileUpload?: (file: File) => void;
}

const FileUploader = ({ onFileUpload }: FileDropUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const processFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);

    if (file.type.startsWith("image/") || file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      console.log(url);
    } else {
      setPreviewUrl(null);
    }

    onFileUpload?.(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
    dropRef.current?.classList.remove("border-primary");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    processFile(file!);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.add("border-primary");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dropRef.current?.classList.remove("border-primary");
  };

  const handleDeleteCurrentFile = (e: React.MouseEvent) => {
    e.preventDefault();
    setFileName(null);
    setPreviewUrl(null);
  };

  return (
    <div
      ref={dropRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {!fileName && (
        <Card className=" space-y-4 border-dashed border-2 border-muted-foreground rounded-lg transition-colors px-6 py-10 text-center w-full">
          <CardContent className="flex flex-col items-center justify-center space-y-2">
            <p className="text-muted-foreground">Drag file ke disini</p>
            <p className="text-xs text-muted-foreground">atau</p>
            <label className="cursor-pointer text-sm text-primary underline">
              Cari di perangkat
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </CardContent>
        </Card>
      )}

      {fileName && (
        <div className="text-sm ">
          <div className="flex justify-between">
            <p>
              File: <strong>{fileName}</strong>
            </p>
            <div onClick={(e) => handleDeleteCurrentFile(e)}>
              <XIcon className="text-muted-foreground" />
            </div>
          </div>
          {previewUrl && (
            <div className="w-full">
              {fileName.endsWith(".pdf") ? (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Open PDF Preview
                </a>
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mt-2 max-h-48 object-contain w-full rounded-md border"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
