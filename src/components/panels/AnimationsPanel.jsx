"use client";

import { useEditor } from "../store";
import { Play, Pause, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function AnimationsPanel() {
  const { animations, activeAnimation, setActiveAnimation, mixer } =
    useEditor();
  const [animationError, setAnimationError] = useState(null);

  useEffect(() => {
    setAnimationError(null);
  }, []);

  const toggleAnimation = (animation) => {
    try {
      if (activeAnimation?.name === animation.name) {
        console.log(`Stopping animation: ${animation.name}`);
        setActiveAnimation(null);
      } else {
        console.log(`Starting animation: ${animation.name}`);
        setActiveAnimation(animation);
      }
      setAnimationError(null);
    } catch (error) {
      console.error("Error toggling animation:", error);
      setAnimationError(`Error playing animation: ${error.message}`);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Animations</h2>
        {animationError && (
          <div className="mt-2 p-2 bg-red-900/30 text-red-300 rounded-md flex items-center text-sm">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{animationError}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {animations.length > 0 ? (
          <ul className="space-y-2">
            {animations.map((animation) => (
              <li key={animation.name}>
                <button
                  onClick={() => toggleAnimation(animation)}
                  className={`w-full flex items-center justify-between p-2 rounded ${
                    activeAnimation?.name === animation.name
                      ? "bg-blue-500 text-white"
                      : "bg-white/20 text-white/80 hover:bg-white/40"
                  }`}
                >
                  <div className="flex items-center">
                    {activeAnimation?.name === animation.name ? (
                      <Pause className="h-4 w-4 mr-2" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    <span>{animation.name}</span>
                  </div>
                  <span className="text-sm opacity-60">
                    {animation.duration.toFixed(2)}s
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-white/40 mt-4">
            No animations found
          </div>
        )}
      </div>
    </div>
  );
}
