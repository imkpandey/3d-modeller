"use client";

import { useState, useEffect } from "react";
import { useEditor } from "../store";
import { ChromePicker } from "react-color";

export default function MaterialsPanel() {
  const {
    selectedObject,
    updateMaterialColor,
    updateMaterialProperty,
    changeMaterialType,
    MATERIAL_TYPES,
    currentMaterialType,
  } = useEditor();

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState({ r: 255, g: 255, b: 255 });
  const [roughness, setRoughness] = useState(0.5);
  const [metalness, setMetalness] = useState(0.5);

  const material = selectedObject?.material;

  useEffect(() => {
    if (material) {
      if (material.color) {
        setCurrentColor({
          r: Math.round(material.color.r * 255),
          g: Math.round(material.color.g * 255),
          b: Math.round(material.color.b * 255),
        });
      }

      if (material.roughness !== undefined) {
        setRoughness(material.roughness);
      }

      if (material.metalness !== undefined) {
        setMetalness(material.metalness);
      }
    }
  }, [material]);

  const handleColorChange = (color) => {
    setCurrentColor(color.rgb);
    updateMaterialColor(color.hex);
  };

  const handleRoughnessChange = (e) => {
    const value = Number.parseFloat(e.target.value);
    setRoughness(value);
    updateMaterialProperty("roughness", value);
  };

  const handleMetalnessChange = (e) => {
    const value = Number.parseFloat(e.target.value);
    setMetalness(value);
    updateMaterialProperty("metalness", value);
  };

  const handleMaterialTypeChange = (e) => {
    changeMaterialType(e.target.value);
  };

  const toggleColorPicker = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Materials</h2>
        {selectedObject?.material && (
          <p className="text-sm text-white/40 truncate">
            {selectedObject.material.name || "Unnamed Material"}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {selectedObject?.material ? (
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                Material Type
              </h3>
              <select
                value={currentMaterialType}
                onChange={handleMaterialTypeChange}
                className="w-full text-black/80 px-3 py-2 rounded-md"
              >
                <option value={MATERIAL_TYPES.STANDARD}>Standard</option>
                <option value={MATERIAL_TYPES.BASIC}>Basic</option>
                <option value={MATERIAL_TYPES.PHONG}>Phong</option>
                <option value={MATERIAL_TYPES.LAMBERT}>Lambert</option>
                <option value={MATERIAL_TYPES.PHYSICAL}>Physical</option>
                <option value={MATERIAL_TYPES.TOON}>Toon</option>
              </select>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Color</h3>
              <div className="flex items-center space-x-2">
                <div
                  className="w-10 h-10 rounded cursor-pointer border border-white/20"
                  style={{
                    backgroundColor: `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`,
                  }}
                  onClick={toggleColorPicker}
                />
                <button
                  onClick={toggleColorPicker}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm"
                >
                  {displayColorPicker ? "Close" : "Change Color"}
                </button>
              </div>

              {displayColorPicker && (
                <div className="absolute mt-2 z-10">
                  <div className="fixed inset-0" onClick={toggleColorPicker} />
                  <ChromePicker
                    color={currentColor}
                    onChange={handleColorChange}
                    disableAlpha
                  />
                </div>
              )}
            </div>

            {material.roughness !== undefined && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Roughness: {roughness.toFixed(2)}
                </h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={roughness}
                  onChange={handleRoughnessChange}
                  className="w-full"
                />
              </div>
            )}

            {material.metalness !== undefined && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                  Metalness: {metalness.toFixed(2)}
                </h3>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={metalness}
                  onChange={handleMetalnessChange}
                  className="w-full"
                />
              </div>
            )}

            <div className="text-sm text-white/60">
              <p>Material Type: {material.type}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-white/40 mt-4">
            {selectedObject
              ? "Selected object has no material"
              : "No object selected"}
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.4);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
