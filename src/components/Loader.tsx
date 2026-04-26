import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="relative w-20 h-20">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-purple-600 animate-spin"></div>
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  bg-linear-to-r from-blue-600 to-purple-600 rounded-full">
        <img src="src/assets/logoonly.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
