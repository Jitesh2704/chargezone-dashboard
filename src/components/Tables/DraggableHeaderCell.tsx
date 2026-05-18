import React from "react";

type ThProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  "data-column-key"?: string;
  onResize?: (deltaX: number) => void;
};

/**
 * Ant Design Table header cell with horizontal drag-to-resize.
 */
const DraggableHeaderCell: React.FC<ThProps> = (props) => {
  const { children, className, style, onResize, ...rest } = props;

  const mergedStyle: React.CSSProperties = {
    ...style,
    backgroundColor: "#2D3394",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 500,
    padding: "8px 16px",
    height: "40px",
    position: "relative",
    userSelect: "none",
    zIndex: 0,
  };

  const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!onResize) return;

    let lastX = event.clientX;
    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - lastX;
      lastX = moveEvent.clientX;
      onResize(delta);
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <th className={className} style={mergedStyle} {...rest}>
      {children}
      <div
        onMouseDown={handleResizeStart}
        className="absolute right-0 top-0 h-full w-2 cursor-col-resize z-10"
      />
    </th>
  );
};

export default DraggableHeaderCell;
