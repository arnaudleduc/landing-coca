import { useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

interface CocaColaBottleProps {
  frameIndex: number;
  isPlaying: boolean;
}

export function CocaColaBottle({ frameIndex, isPlaying }: CocaColaBottleProps) {
  const bottleRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/cocaColaBottle.glb");
  const { actions, mixer } = useAnimations(animations, bottleRef);

  // Activer et jouer la première action uniquement au démarrage de l'animation
  useEffect(() => {
    if (!isPlaying) return;
    if (actions && Object.keys(actions).length > 0) {
      const firstAction = actions[Object.keys(actions)[0]];
      if (firstAction) {
        firstAction.reset();
        firstAction.setLoop(THREE.LoopOnce, 1);
        firstAction.clampWhenFinished = true;
        firstAction.play();
      }
    }
  }, [actions, isPlaying]);

  // Synchronisation stricte frame à frame
  useEffect(() => {
    if (!isPlaying) return;
    if (mixer && animations.length > 0) {
      const duration = animations[0].duration;
      const frameCount = 50;
      const time = (frameIndex / (frameCount - 1)) * duration;
      mixer.setTime(time);
    }
  }, [frameIndex, mixer, animations, isPlaying]);

  return (
    <group
      ref={bottleRef}
      position={[3, -3, 0]}
      scale={[1.2, 1.2, 1.2]}
      rotation={[0, 0, 0]}
    >
      <primitive object={scene} />
    </group>
  );
}

// Précharger le modèle
useGLTF.preload("/models/cocaColaBottle.glb");
