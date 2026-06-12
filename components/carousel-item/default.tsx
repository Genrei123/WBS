import React from "react";
import Image from "next/image";

interface CarouselItemProps {
  backgroundImage: string;
  eyebrow: string;
  title: string;
  description: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  backgroundImage,
  eyebrow,
  title,
  description,
}) => {
  return (
    <div
      className="relative w-full h-[400px] flex items-center justify-center text-white rounded-lg overflow-hidden shadow-lg"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="relative z-10 p-8 max-w-xl">
        <div className="mb-2 text-sm font-semibold uppercase tracking-wider opacity-80">
          {eyebrow}
        </div>
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-lg opacity-90">{description}</p>
      </div>
    </div>
  );
};

export default CarouselItem;
