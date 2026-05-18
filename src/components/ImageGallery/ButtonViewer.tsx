import React, { useState, useEffect } from "react";
import { Image } from "antd";
import { EyeOutlined } from "@ant-design/icons";

interface ButtonViewerProps {
  src: string;
  label?: string;
}

const ButtonViewer: React.FC<ButtonViewerProps> = ({ src, label = "View" }) => {
  const [is3xl, setIs3xl] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkWidth = () => setIs3xl(window.innerWidth >= 1920);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <>
      <button
        onClick={() => setVisible(true)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg 
          bg-[#2D3394] text-white font-medium hover:bg-blue-700 cursor-pointer transition-colors duration-200
          text-sm `}
      >
        <EyeOutlined />
        {label}
      </button>

      <Image
        src={src}
        preview={{
          visible,
          onVisibleChange: (vis) => setVisible(vis),
          zIndex: 999999,
          getContainer: () => document.body,
        }}
        style={{ display: "none" }}
      />
    </>
  );
};

export default ButtonViewer;
