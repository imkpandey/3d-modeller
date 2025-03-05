"use client";

import { useState, useEffect, useRef } from "react";
import { useEditor } from "./store";
import {
  ChevronRight,
  ChevronDown,
  CuboidIcon as Cube,
  FolderIcon,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export default function HierarchyPanel() {
  const {
    modelMeshes,
    selectedObject,
    selectObject,
    expandedItems,
    setExpandedItems,
  } = useEditor();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const selectedItemRef = useRef(null);

  // Enhanced search function that works through all levels of the hierarchy
  const getFilteredMeshes = () => {
    if (!searchTerm.trim()) return modelMeshes;

    // Helper function to search through a node and its children
    const searchNode = (node, term) => {
      // Check if this node matches
      const nodeMatches = node.name.toLowerCase().includes(term.toLowerCase());

      // Create a copy of the node
      const newNode = { ...node };

      // If this node has children, search through them
      if (node.children && node.children.length > 0) {
        newNode.children = node.children
          .map((child) => searchNode(child, term))
          .filter((child) => child !== null);

        // If any children match or this node matches, return the node
        if (newNode.children.length > 0 || nodeMatches) {
          return newNode;
        }
      } else if (nodeMatches) {
        // If this is a leaf node and it matches, return it
        return newNode;
      }

      // No match found in this branch
      return null;
    };

    // Apply search to each top-level node
    return modelMeshes
      .map((node) => searchNode(node, searchTerm))
      .filter((node) => node !== null);
  };

  const filteredMeshes = getFilteredMeshes();

  // Scroll to selected item when it changes
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedObject]);

  // Toggle expanded state for an item
  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Recursive function to render tree items
  const renderTreeItem = (item) => {
    const isExpanded = expandedItems[item.id];
    const hasChildren = item.children && item.children.length > 0;
    const isSelected =
      selectedObject && selectedObject.uuid === item.object.uuid;

    return (
      <li key={item.id}>
        <div
          ref={isSelected ? selectedItemRef : null}
          className={`flex items-center py-1 px-2 rounded cursor-pointer ${
            isSelected ? "bg-blue-500 text-white" : "hover:bg-white/10"
          }`}
          style={{ paddingLeft: `${item.level * 12 + 8}px` }}
          onClick={() => selectObject(item.object)}
        >
          {hasChildren ? (
            <button onClick={(e) => toggleExpand(item.id, e)} className="mr-1">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="w-5 h-5 mr-1 flex items-center justify-center">
              {item.isGroup ? (
                <FolderIcon className="h-3 w-3 text-gray-400" />
              ) : (
                <Cube className="h-3 w-3 text-gray-400" />
              )}
            </span>
          )}
          <span className="truncate">{item.name || "Unnamed Object"}</span>
        </div>
        {hasChildren && isExpanded && (
          <ul className="space-y-1">
            {item.children.map((child) => renderTreeItem(child))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <button
        onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/10 backdrop-blur-md rounded-r-md hover:bg-white/20 transition-colors"
      >
        {isPanelCollapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>

      <div
        className={`absolute left-0 top-0 h-full flex flex-col backdrop-blur-md bg-black/50 z-[1] transition-all duration-300 ${
          isPanelCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
        style={{ width: "20vw" }}
      >
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold mb-2">Hierarchy</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search objects..."
              className="w-full bg-white/20 text-white/80 px-3 py-2 rounded-md pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredMeshes.length > 0 ? (
            <ul className="space-y-1">
              {filteredMeshes.map((item) => renderTreeItem(item))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 mt-4">
              {modelMeshes.length === 0
                ? "No model loaded"
                : "No objects match your search"}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
