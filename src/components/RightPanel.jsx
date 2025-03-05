"use client";

import { useState } from "react";
import { useEditor, PANEL_TYPES } from "./store";
import {
  Move,
  PlayCircle,
  Palette,
  Globe,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import TransformPanel from "./panels/TransformPanel";
import AnimationsPanel from "./panels/AnimationsPanel";
import MaterialsPanel from "./panels/MaterialsPanel";
import EnvironmentPanel from "./panels/EnvironmentPanel";

export default function RightPanel() {
  const { activePanel, setActivePanel } = useEditor();
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const panels = [
    {
      id: PANEL_TYPES.TRANSFORM,
      icon: Move,
      label: "Transform",
      component: TransformPanel,
    },
    {
      id: PANEL_TYPES.ANIMATIONS,
      icon: PlayCircle,
      label: "Animations",
      component: AnimationsPanel,
    },
    {
      id: PANEL_TYPES.MATERIALS,
      icon: Palette,
      label: "Materials",
      component: MaterialsPanel,
    },
    {
      id: PANEL_TYPES.ENVIRONMENT,
      icon: Globe,
      label: "Environment",
      component: EnvironmentPanel,
    },
  ];

  const ActivePanelComponent = panels.find(
    (p) => p.id === activePanel
  )?.component;

  return (
    <>
      <button
        onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/10 backdrop-blur-md rounded-l-md hover:bg-white/20 transition-colors"
      >
        {isPanelCollapsed ? (
          <PanelRightOpen className="h-4 w-4" />
        ) : (
          <PanelRightClose className="h-4 w-4" />
        )}
      </button>

      <div
        className={`absolute right-0 top-0 h-full flex flex-col backdrop-blur-md bg-black/50 z-[1] transition-all duration-300 ${
          isPanelCollapsed ? "translate-x-full" : "translate-x-0"
        }`}
        style={{ width: "20vw" }}
      >
        <div className="absolute left-0 top-4 -translate-x-full z-10 flex flex-col gap-2 p-2 bg-white/10 backdrop-blur-md rounded-l-md">
          {panels.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => {
                if (isPanelCollapsed) setIsPanelCollapsed(false);
                setActivePanel(id);
              }}
              className={`p-2 rounded transition-colors ${
                activePanel === id
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/20"
              }`}
              title={label}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
        {ActivePanelComponent && <ActivePanelComponent />}
      </div>
    </>
  );
}
