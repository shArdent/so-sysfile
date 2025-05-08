import { FolderNode } from "@/types";
import { Button } from "./button";

const FolderTreeItem = ({
  node,
  level = 0,
  onSelect,
}: {
  node: FolderNode;
  level?: number;
  onSelect: (id: string) => void;
}) => {
  return (
    <div className="space-y-1 ml-2  border-l">
      <div className="flex items-center gap-1  cursor-pointer hover:bg-muted py-2 px-4 rounded-md relative">
        <span className="absolute left-0 top-1/2 w-2 h-0.5 bg-gray-300" />
        <span
          className={`w-full justify-start pl-${level * 1}`}
          onClick={() => onSelect(node.id)}
        >
          {node.name}
        </span>
      </div>
      {node.children.map((child) => (
        <FolderTreeItem
          key={child.id}
          node={child}
          level={level + 1}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default FolderTreeItem;
