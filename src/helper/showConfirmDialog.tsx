// utils/showConfirmDialog.ts
import { createRoot } from "react-dom/client";
import { ConfirmDialog } from "./ConfirmDialog";

export const showConfirmDialog = (options: {
  message: string;
}): Promise<boolean> => {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      container.remove();
    };

    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };

    const handleCancel = () => {
      cleanup();
      resolve(false);
    };

    root.render(
      <ConfirmDialog
        message={options.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  });
};
