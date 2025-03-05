"use client";

import { useEditor } from "../store";

export default function EnvironmentsPanel() {
  const { activeEnvironment, setEnvironment } = useEditor();

  const environments = [
    { id: null, name: "None (Grid)" },
    { id: "sunset", name: "Sunset" },
    { id: "dawn", name: "Dawn" },
    { id: "night", name: "Night" },
    { id: "warehouse", name: "Warehouse" },
    { id: "forest", name: "Forest" },
    { id: "apartment", name: "Apartment" },
    { id: "studio", name: "Studio" },
    { id: "city", name: "City" },
    { id: "park", name: "Park" },
    { id: "lobby", name: "Lobby" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Environments</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {environments.map((env) => (
            <li key={env.id || "none"}>
              <button
                onClick={() => setEnvironment(env.id)}
                className={`w-full text-left p-2 rounded transition-colors ${
                  activeEnvironment === env.id
                    ? "bg-blue-500 text-white"
                    : "bg-white/20 text-white/80 hover:bg-white/30"
                }`}
              >
                {env.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
