"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  TransformControls,
  Grid,
  useGLTF,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { useEditor } from "./store";

// Model loader component that handles loading the model
function ModelLoader() {
  const {
    modelUrl,
    setModel,
    setModelMeshes,
    extractMeshes,
    setAnimations,
    mixer,
    setActiveAnimation,
    expandAllItems,
  } = useEditor();

  // Use the useGLTF hook to load the model
  const { scene, animations } = useGLTF(modelUrl || "/placeholder.glb", true);

  useEffect(() => {
    if (scene) {
      console.log("Loading model:", modelUrl);

      // Clone the scene to avoid modifying the cached original
      const clonedScene = scene.clone();

      // Reset animations when loading a new model
      setActiveAnimation(null);

      // Set the model in the context
      setModel(clonedScene);

      // Extract meshes for the hierarchy tree
      const meshes = extractMeshes(clonedScene);
      setModelMeshes(meshes);

      // Expand all items in the hierarchy by default
      expandAllItems(meshes);

      // Set up animation mixer if there are animations
      if (animations && animations.length > 0) {
        // Create a new mixer attached to the cloned scene
        const newMixer = new THREE.AnimationMixer(clonedScene);
        mixer.current = newMixer;

        // Map animations to a more usable format with deep clones of the clips
        const processedAnimations = animations.map((clip) => {
          // Create a deep clone of the animation clip
          const clonedClip = THREE.AnimationClip.parse(
            THREE.AnimationClip.toJSON(clip)
          );
          return {
            name: clip.name,
            duration: clip.duration,
            clip: clonedClip,
          };
        });

        setAnimations(processedAnimations);

        console.log(
          `Loaded ${animations.length} animations:`,
          animations.map((a) => a.name).join(", ")
        );
      } else {
        // Clear animations if none exist
        mixer.current = null;
        setAnimations([]);
        console.log("No animations found in the model");
      }
    }
  }, [
    scene,
    animations,
    setModel,
    setModelMeshes,
    extractMeshes,
    setAnimations,
    mixer,
    setActiveAnimation,
    expandAllItems,
    modelUrl,
  ]);

  return null;
}

// Animation handler component
function AnimationHandler() {
  const { model, mixer, activeAnimation } = useEditor();
  const [currentAction, setCurrentAction] = useState(null);

  // Update the mixer on each frame
  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  // Handle animation changes
  useEffect(() => {
    // Clean up previous animation
    if (currentAction) {
      console.log("Stopping previous animation");
      currentAction.fadeOut(0.5);
      currentAction.stop();
      setCurrentAction(null);
    }

    // Start new animation if selected
    if (mixer.current && activeAnimation && model) {
      console.log(`Playing animation: ${activeAnimation.name}`);

      try {
        // Create a new action from the clip
        const action = mixer.current.clipAction(activeAnimation.clip);

        // Configure the action
        action.reset();
        action.setLoop(THREE.LoopRepeat);
        action.clampWhenFinished = false;
        action.fadeIn(0.5);
        action.play();

        console.log("Animation action created and playing:", action);

        // Store the current action for cleanup
        setCurrentAction(action);

        return () => {
          console.log("Cleaning up animation");
          action.fadeOut(0.5);
          action.stop();
        };
      } catch (error) {
        console.error("Error playing animation:", error);
      }
    }
  }, [activeAnimation, mixer, model, currentAction]);

  return null;
}

// Component to handle the transform controls
function ModelWithTransform() {
  const {
    model,
    selectedObject,
    transformMode,
    setPosition,
    setRotation,
    setScale,
  } = useEditor();

  const transformRef = useRef();
  const originalMaterials = useRef(new Map());

  // Highlight selected object
  useEffect(() => {
    if (!model) return;

    // Reset all materials first
    originalMaterials.current.forEach((originalMaterial, object) => {
      object.material = originalMaterial;
    });
    originalMaterials.current.clear();

    // Highlight the selected object
    if (selectedObject && selectedObject.isMesh) {
      // Store original material
      originalMaterials.current.set(selectedObject, selectedObject.material);

      // Create highlight material based on original
      const highlightMaterial = selectedObject.material.clone();
      highlightMaterial.emissive = new THREE.Color(0x3333ff);
      highlightMaterial.emissiveIntensity = 0.3;

      // Apply highlight material
      selectedObject.material = highlightMaterial;
    }

    return () => {
      // Cleanup on unmount
      originalMaterials.current.forEach((originalMaterial, object) => {
        object.material = originalMaterial;
      });
    };
  }, [selectedObject, model]);

  // Update transform values when controls change
  useEffect(() => {
    if (!transformRef.current || !selectedObject) return;

    const controls = transformRef.current;

    const handleChange = () => {
      if (selectedObject) {
        setPosition([
          selectedObject.position.x,
          selectedObject.position.y,
          selectedObject.position.z,
        ]);

        setRotation([
          selectedObject.rotation.x,
          selectedObject.rotation.y,
          selectedObject.rotation.z,
        ]);

        setScale([
          selectedObject.scale.x,
          selectedObject.scale.y,
          selectedObject.scale.z,
        ]);
      }
    };

    controls.addEventListener("change", handleChange);
    controls.addEventListener("dragging-changed", (event) => {
      // Disable orbit controls when transforming
      const orbitControls = document.querySelector(".orbit-controls");
      if (orbitControls) {
        orbitControls.__instance.enabled = !event.value;
      }
    });

    return () => {
      controls.removeEventListener("change", handleChange);
      controls.removeEventListener("dragging-changed", () => {});
    };
  }, [selectedObject, setPosition, setRotation, setScale]);

  // If no model is loaded, return null
  if (!model) return null;

  return (
    <>
      <primitive object={model} />

      {selectedObject && (
        <TransformControls
          ref={transformRef}
          object={selectedObject}
          mode={transformMode}
          size={0.75}
        />
      )}
    </>
  );
}

// Raycaster that selects model meshes
function ViewportRaycaster() {
  const { camera, gl } = useThree();
  const { model, selectObject } = useEditor();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  useEffect(() => {
    const handleClick = (event) => {
      if (!model) return;

      // Calculate mouse position in normalized device coordinates
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.current.setFromCamera(mouse.current, camera);

      // Only check intersections with objects that are part of the loaded model
      const modelObjects = [];
      model.traverse((object) => {
        if (object.isMesh) {
          modelObjects.push(object);
        }
      });

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.current.intersectObjects(
        modelObjects,
        false
      );

      if (intersects.length > 0) {
        selectObject(intersects[0].object);
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [camera, gl, model, selectObject]);

  return null;
}

// Custom OrbitControls wrapper to expose the controls instance
function CustomOrbitControls(props) {
  const { gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      gl.domElement.classList.add("orbit-controls");
      gl.domElement.__instance = controlsRef.current;
    }
  }, [gl]);

  return <OrbitControls ref={controlsRef} {...props} />;
}

// Environment component
function SceneEnvironment() {
  const { activeEnvironment, showGrid } = useEditor();

  return (
    <>
      {showGrid && (
        <Grid
          position={[0, -0.01, 0]}
          args={[10, 10]}
          cellSize={1}
          cellThickness={1}
          cellColor="#6f6f6f"
          sectionSize={3}
          sectionThickness={1.5}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1}
          infiniteGrid
        />
      )}

      {activeEnvironment ? (
        <Environment preset={activeEnvironment} background={true} />
      ) : (
        <Environment preset="studio" background={false} />
      )}
    </>
  );
}

export default function Scene() {
  const { modelUrl } = useEditor();

  return (
    <div className="flex-1 h-full">
      <Canvas
        shadows
        camera={{ position: [5, 6, 10], fov: 50 }}
        className="w-full h-full bg-[#191919]"
      >
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />

        <CustomOrbitControls makeDefault />

        <SceneEnvironment />

        {modelUrl && <ModelLoader />}
        <ModelWithTransform />
        <ViewportRaycaster />
        <AnimationHandler />

        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport
            axisColors={["#ff3653", "#8adb00", "#2c8fff"]}
            labelColor="white"
          />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}
