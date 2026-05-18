import React, { useState, useEffect } from "react";
import { Image } from "antd";

interface SingleImageViewerProps {
  src: string;
}

const SingleImageViewer: React.FC<SingleImageViewerProps> = ({ src }) => {
  const [is3xl, setIs3xl] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIs3xl(window.innerWidth >= 1920);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <Image
      src={src}
      alt="Example"
      style={{
        height: is3xl ? "56px" : "70px",
        width: is3xl ? "56px" : "70px",
        zIndex: 9999999,
        borderRadius: "8px",
        objectFit: "cover",
      }}
      preview={{
        zIndex: 999999,
        getContainer: () => document.body,
      }}
    />
  );
};

export default SingleImageViewer;
