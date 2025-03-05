"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import * as THREE from "three";

export const UPLOAD_STATES = {
  INITIAL: "initial",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export const PANEL_TYPES = {
  TRANSFORM: "transform",
  ANIMATIONS: "animations",
  MATERIALS: "materials",
  ENVIRONMENTS: "environments",
};

export const MATERIAL_TYPES = {
  STANDARD: "MeshStandardMaterial",
  BASIC: "MeshBasicMaterial",
  PHONG: "MeshPhongMaterial",
  LAMBERT: "MeshLambertMaterial",
  PHYSICAL: "MeshPhysicalMaterial",
  TOON: "MeshToonMaterial",
};

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
  const [model, setModel] = useState(null);
  const [modelUrl, setModelUrl] = useState("/placeholder.glb");
  const [modelName, setModelName] = useState("");
  const [modelMeshes, setModelMeshes] = useState([]);
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState([0, 0, 0]);
  const [scale, setScale] = useState([1, 1, 1]);
  const [showUploadDialog, setShowUploadDialog] = useState(true);
  const [fileUploadState, setFileUploadState] = useState(UPLOAD_STATES.INITIAL);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedObject, setSelectedObject] = useState(null);
  const [transformMode, setTransformMode] = useState("translate");
  const [activePanel, setActivePanel] = useState(PANEL_TYPES.TRANSFORM);
  const [expandedItems, setExpandedItems] = useState({});
  const [animations, setAnimations] = useState([]);
  const [activeAnimation, setActiveAnimation] = useState(null);
  const [activeEnvironment, setActiveEnvironment] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const mixer = useRef(null);
  const objectInitialTransforms = useRef(new Map());
  const originalMaterials = useRef(new Map());

  // Function to extract all objects (groups and meshes) from a model
  const extractMeshes = useCallback(
    (object, result = [], parent = null, level = 0) => {
      if (!object) return result;

      // Store initial transforms
      if (object.isMesh || object.isGroup) {
        // Store initial transform in a ref Map for better persistence
        objectInitialTransforms.current.set(object.uuid, {
          position: object.position.clone(),
          rotation: object.rotation.clone(),
          scale: object.scale.clone(),
        });

        // Store original material for meshes
        if (object.isMesh && object.material) {
          originalMaterials.current.set(object.uuid, object.material.clone());
        }
      }

      // Create node for current object
      const node = {
        id: object.uuid,
        name: object.name || `Object_${result.length}`,
        object: object,
        children: [],
        level: level,
        isGroup: object.isGroup,
        isMesh: object.isMesh,
        path: parent
          ? `${parent.path}.${object.name || `Object_${result.length}`}`
          : object.name || `Object_${result.length}`,
      };

      // Add to parent's children if parent exists
      if (parent) {
        parent.children.push(node);
      } else {
        // Add to root level if no parent
        result.push(node);
      }

      // Process children
      if (object.children && object.children.length > 0) {
        object.children.forEach((child) => {
          extractMeshes(child, result, node, level + 1);
        });
      }

      return result;
    },
    []
  );

  // Function to expand all items in the hierarchy
  const expandAllItems = useCallback((meshes) => {
    const newExpandedItems = {};

    const processNode = (node) => {
      newExpandedItems[node.id] = true;

      if (node.children && node.children.length > 0) {
        node.children.forEach(processNode);
      }
    };

    meshes.forEach(processNode);
    setExpandedItems(newExpandedItems);
  }, []);

  // Function to expand parents of selected object
  const expandToObject = useCallback(
    (objectPath) => {
      if (!objectPath) return;

      const parts = objectPath.split(".");
      const newExpanded = { ...expandedItems };

      // Expand each parent in the path
      for (let i = 1; i <= parts.length; i++) {
        const path = parts.slice(0, i).join(".");
        newExpanded[path] = true;
      }

      setExpandedItems(newExpanded);
    },
    [expandedItems]
  );

  // Function to find an object's path in the hierarchy
  const findObjectPath = useCallback((meshes, targetObject) => {
    if (!targetObject) return null;

    const findPath = (nodes) => {
      for (const node of nodes) {
        if (node.object.uuid === targetObject.uuid) {
          return node.path;
        }

        if (node.children && node.children.length > 0) {
          const childPath = findPath(node.children);
          if (childPath) return childPath;
        }
      }
      return null;
    };

    return findPath(meshes);
  }, []);

  // Function to select an object in the hierarchy
  const selectObject = useCallback(
    (object) => {
      if (!object) {
        setSelectedObject(null);
        setPosition([0, 0, 0]);
        setRotation([0, 0, 0]);
        setScale([1, 1, 1]);
        return;
      }

      // Get initial transform values from our stored map
      const initialTransform = objectInitialTransforms.current.get(
        object.uuid
      ) || {
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Euler(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
      };

      // Update transform values with current object values (not initial)
      setPosition([object.position.x, object.position.y, object.position.z]);

      setRotation([object.rotation.x, object.rotation.y, object.rotation.z]);

      setScale([object.scale.x, object.scale.y, object.scale.z]);

      setSelectedObject(object);

      // Expand parents in hierarchy
      const objectPath = findObjectPath(modelMeshes, object);
      if (objectPath) {
        expandToObject(objectPath);
      }
    },
    [modelMeshes, expandToObject, findObjectPath]
  );

  // Function to update transform values for the selected object
  const updateTransform = useCallback(
    (type, axis, value) => {
      if (!selectedObject) return;

      const newValue = Number.parseFloat(value);
      if (isNaN(newValue)) return;

      if (type === "position") {
        const newPosition = [...position];
        newPosition[axis] = newValue;
        setPosition(newPosition);
        selectedObject.position.set(
          newPosition[0],
          newPosition[1],
          newPosition[2]
        );
      } else if (type === "rotation") {
        const newRotation = [...rotation];
        newRotation[axis] = (newValue * Math.PI) / 180; // Convert to radians
        setRotation(newRotation);
        selectedObject.rotation.set(
          newRotation[0],
          newRotation[1],
          newRotation[2]
        );
      } else if (type === "scale") {
        const newScale = [...scale];
        newScale[axis] = newValue;
        setScale(newScale);
        selectedObject.scale.set(newScale[0], newScale[1], newScale[2]);
      }
    },
    [selectedObject, position, rotation, scale]
  );

  // Function to update material color
  const updateMaterialColor = useCallback(
    (color) => {
      if (!selectedObject || !selectedObject.material) return;

      // Clone the material to avoid affecting other objects with the same material
      if (!selectedObject.material._isCloned) {
        selectedObject.material = selectedObject.material.clone();
        selectedObject.material._isCloned = true;
      }

      // Update the material color
      selectedObject.material.color.set(color);

      // Store the updated material
      originalMaterials.current.set(
        selectedObject.uuid,
        selectedObject.material.clone()
      );
    },
    [selectedObject]
  );

  // Function to update material properties
  const updateMaterialProperty = useCallback(
    (property, value) => {
      if (!selectedObject || !selectedObject.material) return;

      // Clone the material to avoid affecting other objects with the same material
      if (!selectedObject.material._isCloned) {
        selectedObject.material = selectedObject.material.clone();
        selectedObject.material._isCloned = true;
      }

      // Update the material property
      selectedObject.material[property] = value;

      // Store the updated material
      originalMaterials.current.set(
        selectedObject.uuid,
        selectedObject.material.clone()
      );
    },
    [selectedObject]
  );

  // Function to change material type
  const changeMaterialType = useCallback(
    (materialType) => {
      if (!selectedObject) return;

      const currentMaterial = selectedObject.material;
      if (!currentMaterial) return;

      // Create a new material of the selected type
      let newMaterial;

      switch (materialType) {
        case MATERIAL_TYPES.BASIC:
          newMaterial = new THREE.MeshBasicMaterial();
          break;
        case MATERIAL_TYPES.LAMBERT:
          newMaterial = new THREE.MeshLambertMaterial();
          break;
        case MATERIAL_TYPES.PHONG:
          newMaterial = new THREE.MeshPhongMaterial();
          break;
        case MATERIAL_TYPES.STANDARD:
          newMaterial = new THREE.MeshStandardMaterial();
          break;
        case MATERIAL_TYPES.PHYSICAL:
          newMaterial = new THREE.MeshPhysicalMaterial();
          break;
        case MATERIAL_TYPES.TOON:
          newMaterial = new THREE.MeshToonMaterial();
          break;
        default:
          newMaterial = new THREE.MeshStandardMaterial();
      }

      // Copy common properties
      newMaterial.color.copy(
        currentMaterial.color || new THREE.Color(0xffffff)
      );
      if (currentMaterial.map) newMaterial.map = currentMaterial.map;
      if (currentMaterial.normalMap)
        newMaterial.normalMap = currentMaterial.normalMap;

      // Copy material-specific properties if they exist
      if (
        currentMaterial.metalness !== undefined &&
        newMaterial.metalness !== undefined
      ) {
        newMaterial.metalness = currentMaterial.metalness;
      }

      if (
        currentMaterial.roughness !== undefined &&
        newMaterial.roughness !== undefined
      ) {
        newMaterial.roughness = currentMaterial.roughness;
      }

      if (
        currentMaterial.emissive !== undefined &&
        newMaterial.emissive !== undefined
      ) {
        newMaterial.emissive.copy(currentMaterial.emissive);
      }

      // Mark as cloned
      newMaterial._isCloned = true;

      // Apply the new material
      selectedObject.material = newMaterial;

      // Store the updated material
      originalMaterials.current.set(selectedObject.uuid, newMaterial.clone());
    },
    [selectedObject]
  );

  // Function to set environment
  const setEnvironment = useCallback((preset) => {
    setActiveEnvironment(preset);
    setShowGrid(preset === null);
  }, []);

  // Reset state when loading a new model
  const resetEditorState = useCallback(() => {
    setSelectedObject(null);
    setPosition([0, 0, 0]);
    setRotation([0, 0, 0]);
    setScale([1, 1, 1]);
    setExpandedItems({});

    // Properly clean up animations
    if (mixer.current) {
      // Stop all running animations
      mixer.current.stopAllAction();
      // Uncache all clips
      mixer.current.uncacheRoot(mixer.current.getRoot());
      mixer.current = null;
    }
    setActiveAnimation(null);

    objectInitialTransforms.current.clear();
    originalMaterials.current.clear();
  }, []);

  const value = {
    model,
    setModel,
    modelUrl,
    setModelUrl,
    modelName,
    setModelName,
    modelMeshes,
    setModelMeshes,
    position,
    setPosition,
    rotation,
    setRotation,
    scale,
    setScale,
    selectedObject,
    setSelectedObject,
    selectObject,
    showUploadDialog,
    setShowUploadDialog,
    fileUploadState,
    setFileUploadState,
    errorMessage,
    setErrorMessage,
    extractMeshes,
    updateTransform,
    transformMode,
    setTransformMode,
    activePanel,
    setActivePanel,
    expandedItems,
    setExpandedItems,
    animations,
    setAnimations,
    activeAnimation,
    setActiveAnimation,
    mixer,
    resetEditorState,
    findObjectPath,
    expandAllItems,
    updateMaterialColor,
    updateMaterialProperty,
    changeMaterialType,
    activeEnvironment,
    setActiveEnvironment,
    setEnvironment,
    showGrid,
    setShowGrid,
    MATERIAL_TYPES,
  };

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
