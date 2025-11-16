import { ResponsiveDialog } from "@/components/responsive-dialog";
import { ProjectForm } from "./project-form";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewProjectDialog = ({
  open,
  onOpenChange,
}: NewProjectDialogProps) => {
  return (
    <ResponsiveDialog
      title="New Project"
      description="Create new project"
      open={open}
      onOpenChange={onOpenChange}
    >
      <ProjectForm
        onCancel={() => onOpenChange(false)}
        onSuccess={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};
