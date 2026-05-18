import React, { useEffect, useState } from "react";
import { Image } from "antd";
import { formatDateIST, formatTimeIST } from "../../helpers/dateFormatter";

interface SignedURL {
  timestamp: string;
  url: string;
}

interface ImageGalleryProps {
  signedURLS: SignedURL[];
}

const ImageSlider: React.FC<ImageGalleryProps> = ({ signedURLS }) => {
  const [images, setImages] = useState<SignedURL[]>([]);

  useEffect(() => {
    setImages(signedURLS);
  }, [signedURLS]);

  return (
    <div className="w-auto max-h-[40vh]">
      <div className="mt-1 mb-1">
        <span className="text-[12px] font-medium text-[#898989]">
          Service Timeline
        </span>
      </div>

      <div className="flex flex-wrap items-start gap-2">
        <Image.PreviewGroup
          preview={{
            zIndex: 999999,
            getContainer: () => document.body,
          }}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className="flex flex-row items-stretch"
            >
              <div className="flex flex-col gap-1 items-center justify-start min-w-[72px] px-1">
                <p className="text-[10px] text-gray-500 leading-none">
                  {img.timestamp && img.timestamp.includes("T")
                    ? formatDateIST(img.timestamp)
                    : "--"}
                </p>
                <p className="text-[10px] text-gray-500 leading-none">
                  {img.timestamp && img.timestamp.includes("T")
                    ? formatTimeIST(img.timestamp)
                    : img.timestamp || "--:--"}
                </p>
                {img.url === "No Image" ? (
                  <div className="w-16 h-16 flex items-center justify-center rounded bg-gray-300 text-[10px] text-gray-600">
                    No Image
                  </div>
                ) : (
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-200 hover:bg-black/50 transition-colors">
                    <Image
                      alt={`Inspection ${index}`}
                      src={img.url}
                      width={64}
                      height={64}
                      className="object-cover"
                      style={{ zIndex: 30000 }}
                      preview={{
                        zIndex: 999999,
                        getContainer: () => document.body,
                      }}
                    />
                  </div>
                )}
              </div>
              {index !== images.length - 1 && (
                <div className="mx-1 w-px bg-gray-200 self-stretch" />
              )}
            </div>
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  );
};

export default ImageSlider;
