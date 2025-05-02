import { PropsWithChildren } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import NewFolderDialog from "../fragments/NewFolderDialog";

const ContextPage = ({ children }: PropsWithChildren) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="p-0">{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <NewFolderDialog />
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ContextPage;
