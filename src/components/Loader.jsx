import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-t-4 rounded-full animate-spin border-t-black" 
           style={{
             borderImage: 'black',
             borderImageSlice: 1,
           }}
      ></div>
    </div>
  );
};

export default Loader;
