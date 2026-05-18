import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface SidePopUpProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: string;
  height?: string;
  zIndex?: string;
  rounded?: string;
  hideCloseButton?: boolean;
}

const SidePopup: React.FC<SidePopUpProps> = ({
  isOpen,
  onClose,
  children,
  width = "w-1/2",
  height = "h-screen",
  zIndex = "z-[212000]!",
  rounded = "rounded-2xl",
  hideCloseButton = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-end ${zIndex} overflow-y-hidden`}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black opacity-50 transition-opacity z-0"
        onClick={onClose}
      />
      <div
        className={`relative bg-white ${rounded} shadow-lg border border-gray-200 ${width} ${height} p-2 z-10`}
      >
        {!hideCloseButton && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            className="absolute! top-3 right-4 text-gray-600 hover:text-gray-700 z-20"
            size="large"
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        )}

        {children}
      </div>
    </div>
  );
};

export default SidePopup;
