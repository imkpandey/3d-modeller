import React from "react";
import { useEditor } from "./store";

export default function Navbar() {
  const { modelName, setShowUploadDialog } = useEditor();

  return (
    <div className="w-full bg-black/60 border-b border-white/10 text-white p-2 flex justify-between items-center z-[99]">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img src="/ctruh.png" alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold">3D Model Viewer</h1>
        </div>
        {modelName && (
          <span className="px-2 py-1 bg-white/20 rounded text-sm">
            {modelName}
          </span>
        )}
      </div>

      <button
        onClick={() => setShowUploadDialog(true)}
        className="inline-flex items-center justify-center px-2 py-1.5 text-base font-medium leading-6 text-gray-600 whitespace-no-wrap bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:shadow-none"
      >
        Upload Model
      </button>
    </div>
  );
}
