"use client";

import { useEditor } from "../store";
import { Move, RotateCw, Maximize } from "lucide-react";

export default function TransformPanel() {
  const {
    selectedObject,
    position,
    rotation,
    scale,
    updateTransform,
    transformMode,
    setTransformMode,
  } = useEditor();

  const rotationDegrees = rotation.map((rad) =>
    Math.round((rad * 180) / Math.PI)
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Transform</h2>
        {selectedObject && (
          <p className="text-sm text-white/40 truncate">
            {selectedObject.name}
          </p>
        )}
      </div>

      <div className="p-4 border-b border-white/10">
        <div className="flex space-x-2 mb-4">
          <button
            className={`flex-1 flex items-center justify-center py-1 px-2 rounded ${
              transformMode === "translate"
                ? "bg-white/90 text-black"
                : "bg-white/20 text-white/80 hover:bg-white/40"
            }`}
            onClick={() => setTransformMode("translate")}
          >
            <Move className="h-4 w-4 mr-2" />
            Move
          </button>
          <button
            className={`flex-1 flex items-center justify-center py-1 px-2 rounded ${
              transformMode === "rotate"
                ? "bg-white/90 text-black"
                : "bg-white/20 text-white/80 hover:bg-white/40"
            }`}
            onClick={() => setTransformMode("rotate")}
          >
            <RotateCw className="h-4 w-4 mr-2" />
            Rotate
          </button>
          <button
            className={`flex-1 flex items-center justify-center py-1 px-2 rounded ${
              transformMode === "scale"
                ? "bg-white/90 text-black"
                : "bg-white/20 text-white/80 hover:bg-white/40"
            }`}
            onClick={() => setTransformMode("scale")}
          >
            <Maximize className="h-4 w-4 mr-2" />
            Scale
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selectedObject ? (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Move className="h-4 w-4 mr-2" />
                Position
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">X</label>
                  <input
                    type="number"
                    value={position[0].toFixed(2)}
                    onChange={(e) =>
                      updateTransform("position", 0, e.target.value)
                    }
                    className="w-full bg-white/20 text-white/80 px-2 py-1 rounded-md"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Y</label>
                  <input
                    type="number"
                    value={position[1].toFixed(2)}
                    onChange={(e) =>
                      updateTransform("position", 1, e.target.value)
                    }
                    className="w-full bg-white/20 text-white/80 px-2 py-1 rounded-md"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Z</label>
                  <input
                    type="number"
                    value={position[2].toFixed(2)}
                    onChange={(e) =>
                      updateTransform("position", 2, e.target.value)
                    }
                    className="w-full bg-white/20 text-white/80 px-2 py-1 rounded-md"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                <RotateCw className="h-4 w-4 mr-2" />
                Rotation (degrees)
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">X</label>
                  <input
                    type="number"
                    value={rotationDegrees[0]}
                    onChange={(e) =>
                      updateTransform("rotation", 0, e.target.value)
                    }
                    className="w-full bg-white/20 text-white/80 px-2 py-1 rounded-md"
                    step="5"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Y</label>
                  <input
                    type="number"
                    value={rotationDegrees[1]}
                    onChange={(e) =>
                      updateTransform("rotation", 1, e.target.value)
                    }
                    className="w-full bg-white/20 text-white/80 px-2 py-1 rounded-md"
                    step="5"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Z</label>
                  <input
                    type="number"
                    value={rotationDegrees[2]}
                    onChange={(e) =>
                      updateTransform("rotation", 2, e.target.value)
                    }
                    className="w-full bg-white/20 text-white/80 px-2 py-1 rounded-md"
                    step="5"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Maximize className="h-4 w-4 mr-2" />
                Scale
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">X</label>
                  <input
                    type="number"
                    value={scale[0].toFixed(2)}
                    onChange={(e) =>
                      updateTransform("scale", 0, e.target.value)
                    }
                    className="w-full bg-white/20 text-white/80 px-2 py-1 rounded-md"
                    step="0.01"
                    min="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Y</label>
                  <input
                    type="number"
                    value={scale[1].toFixed(2)}
                    onChange={(e) =>
                      updateTransform("scale", 1, e.target.value)
                    }
                    className="w-full bg-white/20 text-white/80 px-2 py-1 rounded-md"
                    step="0.01"
                    min="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Z</label>
                  <input
                    type="number"
                    value={scale[2].toFixed(2)}
                    onChange={(e) =>
                      updateTransform("scale", 2, e.target.value)
                    }
                    className="w-full bg-white/20 text-white/80 px-2 py-1 rounded-md"
                    step="0.01"
                    min="0.01"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-white/40 mt-4">
            No object selected
          </div>
        )}
      </div>
    </div>
  );
}
