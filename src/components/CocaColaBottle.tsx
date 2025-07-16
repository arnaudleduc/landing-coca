import { useGLTF, useAnimations, Float } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

interface CocaColaBottleProps {
  frameIndex: number;
  isPlaying: boolean;
  texture: string;
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

export function CocaColaBottle({
  frameIndex,
  isPlaying,
  texture,
}: CocaColaBottleProps) {
  const bottleRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/cocaColaBottle.glb");
  const { actions, mixer } = useAnimations(animations, bottleRef);

  // État pour les modèles de fluide
  const [fluidModels, setFluidModels] = useState<THREE.Group[]>([]);
  const frameCount = 50;
  const framePaths = Array.from(
    { length: frameCount },
    (_, i) => `/fluidAnim/fluidDomain_${String(i + 1).padStart(3, "0")}.glb`
  );

  // Charger les modèles de fluide
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
        if (mounted) setFluidModels(loadedModels);
      } catch (error) {
        console.error("Erreur lors du chargement des modèles:", error);
      }
    };
    loadModels();
    return () => {
      mounted = false;
    };
  }, []);

  // Appliquer la texture au modèle avec transition
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const textureLoader = new THREE.TextureLoader();

          // Faire un fade out rapide
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.opacity = 0.3;
            child.material.transparent = true;
          }

          // Charger la nouvelle texture
          textureLoader.load(texture, (loadedTexture) => {
            loadedTexture.flipY = false;

            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.map = loadedTexture;
              child.material.needsUpdate = true;

              // Fade in progressif
              let opacity = 0.3;
              const fadeIn = () => {
                opacity += 0.05;
                child.material.opacity = opacity;

                if (opacity < 1) {
                  requestAnimationFrame(fadeIn);
                } else {
                  child.material.transparent = false;
                }
              };

              setTimeout(() => {
                requestAnimationFrame(fadeIn);
              }, 100);
            }
          });
        }
      });
    }
  }, [scene, texture]);

  // Activer et jouer la première action uniquement au démarrage de l'animation
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      if (firstAction) {
        if (isPlaying) {
          firstAction.reset();
          firstAction.setLoop(THREE.LoopOnce, 1);
          firstAction.clampWhenFinished = true;
          firstAction.timeScale = 1;
          firstAction.play();
        } else {
          // Réinitialiser l'animation quand isPlaying devient false
          firstAction.reset();
          firstAction.stop();
        }
      }
    }
  }, [actions, isPlaying]);

  // Synchronisation stricte frame à frame
  useEffect(() => {
    if (!isPlaying) return;
    if (mixer && animations.length > 0) {
      const duration = animations[0].duration;
      const frameCount = 50;

      // Calculer le temps pour l'animation forward
      const time = (frameIndex / (frameCount - 1)) * duration;
      mixer.setTime(time);
    }
  }, [frameIndex, mixer, animations, isPlaying]);

  // Réinitialiser l'animation quand frameIndex revient à 0
  useEffect(() => {
    if (frameIndex === 0 && !isPlaying && mixer && animations.length > 0) {
      mixer.setTime(0); // Remettre à l'état initial
    }
  }, [frameIndex, isPlaying, mixer, animations]);

  return (
    <Float floatIntensity={2} rotationIntensity={0} speed={1}>
      <group
        ref={bottleRef}
        position={[3, -3, 0]}
        scale={[1.2, 1.2, 1.2]}
        rotation={[0.05, 0, 0]}
      >
        {/* Modèle de la bouteille */}
        <primitive object={scene} />

        {/* Animation de fluide */}
        {fluidModels[frameIndex] && (
          <primitive object={fluidModels[frameIndex]} />
        )}
      </group>
    </Float>
  );
}

// Précharger le modèle
useGLTF.preload("/models/cocaColaBottle.glb");
