import React, { useRef, useState, useEffect } from "react";
import { Save, X } from "lucide-react";

const VideoWithROI = ({
  video,
  initialROIs = [],
  tempROIs = [],
  setTempROIs,
  onROIChange,
  onChanges,
  onDelete,
  saveTempROI,
}) => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [rois, setROIs] = useState([]);
  const [videoSrc, setVideoSrc] = useState(video);

  useEffect(() => {
    setROIs(initialROIs);
  }, [initialROIs]);

  useEffect(() => {
    drawROIs();
  }, [points, rois, tempROIs]);

  useEffect(() => {
    onROIChange?.(rois);
    onChanges?.(true);
  }, [rois]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints((prev) => [...prev, { x, y }]);
  };

  const drawROIs = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark overlay
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawPolygon = (pts, color, dottedClose) => {
      if (pts.length < 2) return;

      // Cut-out
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p, i) => i > 0 && ctx.lineTo(p.x, p.y));
      if (pts.length > 2) ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";

      // Solid edges
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      pts.forEach((p, i) => i > 0 && ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // Optional dotted closing edge
      if (dottedClose && pts.length > 3) {
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.lineTo(pts[0].x, pts[0].y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Solid close for non-dotted
      if (!dottedClose && pts.length > 2) {
        ctx.beginPath();
        ctx.moveTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
        ctx.lineTo(pts[0].x, pts[0].y);
        ctx.stroke();
      }
    };

    // FINAL SAVED ROIs — SOLID
    rois.forEach((roi) => drawPolygon(roi.points, "green", false));

    // TEMP ROIs — SOLID
    tempROIs.forEach((roi) => drawPolygon(roi, "orange", false));

    //  CURRENT DRAWING — DOTTED CLOSE
    drawPolygon(points, "orange", true);

    // Points
    points.forEach((p) => {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const lastPoint = points[points.length - 1];

  return (
    <div className="relative w-full aspect-video bg-black overflow-hidden rounded-md border border-gray-300">
      <video
        src={videoSrc}
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
      />

      <canvas
        ref={canvasRef}
        width={1024}
        height={576}
        onClick={handleCanvasClick}
        className="absolute inset-0 z-10 cursor-crosshair w-full h-full object-cover"
      />

      {points.length > 3 && lastPoint && (
        <div
          className="absolute z-20 flex gap-2 bg-black/70 p-1.5 rounded-lg shadow-lg"
          style={{
            top: Math.min(lastPoint.y - 40, 500),
            left: Math.min(lastPoint.x + 10, 900),
          }}
        >
          <button
            onClick={() => {
              saveTempROI(points);
              setPoints([]);
            }}
            title="Save ROI"
            className="flex items-center cursor-pointer justify-center bg-white border border-gray-300 rounded-md p-1.5 hover:bg-gray-100"
          >
            <Save size={16} className="text-[#1e2d5b]" />
          </button>

          <button
            onClick={() => setPoints([])}
            title="Cancel ROI"
            className="flex items-center cursor-pointer justify-center bg-white border border-gray-300 rounded-md p-1.5 hover:bg-gray-100"
          >
            <X size={16} className="text-red-500" />
          </button>
        </div>
      )}

      {rois.map((roi, idx) => (
        <div
          key={idx}
          className="absolute z-20 flex items-center gap-2 bg-black/70 p-2 rounded-md"
          style={{
            top: roi.points[0]?.y,
            left: roi.points[0]?.x,
          }}
        >
          <span className="text-xs text-white">{roi?.data?.name}</span>
          <button
            onClick={() => onDelete?.(roi?.data?.name)}
            className="text-[10px] text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700 font-medium"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default VideoWithROI;
