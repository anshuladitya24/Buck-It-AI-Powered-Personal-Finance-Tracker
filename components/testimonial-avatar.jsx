"use client";

import Image from "next/image";
import { useState } from "react";

const TestimonialAvatar = ({ src, alt, initials, className }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div className={`w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className={`w-10 h-10 rounded-full object-cover ${className}`}
      onError={handleImageError}
      onLoadingComplete={() => setImageError(false)}
    />
  );
};

export default TestimonialAvatar;
