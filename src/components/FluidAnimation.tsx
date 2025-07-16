import { useState, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

interface FluidAnimationProps {
  frameIndex: number;
}

function applyFluidMaterialToGroup(group: THREE.Group) {
  const fluidMaterial = new THREE.MeshPhysicalMaterial({
    color: "#280D02",
    metalness: 0,
    roughness: 0,
    ior: 1.333,
    transmission: 1,
    opacity: 1,
    transparent: true,
    thickness: 0.5,
    envMapIntensity: 1,
  });
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).material = fluidMaterial;
    }
  });
}

export function FluidAnimation({ frameIndex }: FluidAnimationProps) {
  const [models, setModels] = useState<THREE.Group[]>([]);
  const frameCount = 50;
  const framePaths = Array.from(
    { length: frameCount },
    (_, i) => `/fluidAnim/fluidDomain_${String(i + 1).padStart(3, "0")}.glb`
  );

  useEffect(() => {
    let mounted = true;
    const loadModels = async () => {
      const loadedModels: THREE.Group[] = [];
      try {
        for (let i = 0; i < frameCount; i++) {
          const response = await fetch(framePaths[i]);
          const arrayBuffer = await response.arrayBuffer();
          const loader = new GLTFLoader();
          const gltf = await new Promise<GLTF>((resolve, reject) => {
            loader.parse(arrayBuffer, "", resolve, reject);
          });
          const clonedScene = gltf.scene.clone();
          applyFluidMaterialToGroup(clonedScene);
          loadedModels.push(clonedScene);
        }
        if (mounted) setModels(loadedModels);
      } catch (error) {
        console.error("Erreur lors du chargement des modèles:", error);
      }
    };
    loadModels();
    return () => {
      mounted = false;
    };
  }, []);

  if (!models[frameIndex]) {
    return null;
  }

  return (
    <group position={[3, -3, 0]} scale={[1, 1, 1]}>
      <primitive object={models[frameIndex]} />
    </group>
  );
}
