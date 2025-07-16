import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Environment, useProgress, Html } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { CocaColaBottle } from "./components/CocaColaBottle";
import { FluidAnimation } from "./components/FluidAnimation";
import "./App.css";

function LoadingProgress({
  onProgress,
}: {
  onProgress: (progress: number) => void;
}) {
  const { progress } = useProgress();

  useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);

  return null;
}

function LoaderInCanvas() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="relative w-96 h-24 bg-coca-cola-red overflow-hidden mb-4">
          <motion.div
            className="absolute top-0 left-0 h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
          <img
            src="/loader/loaderMask.png"
            alt="Loader Mask"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-white text-lg font-medium"
        >
          Chargement...
        </motion.div>
      </div>
    </Html>
  );
}

function FullScreenLoader({ progress }: { progress: number }) {
  const [isComplete, setIsComplete] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setIsComplete(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 1000); // Durée du fade out
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  if (!shouldRender) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-coca-cola-red z-[9999] flex items-center justify-center"
      animate={isComplete ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center">
        <div className="relative w-96 h-24 bg-coca-cola-red overflow-hidden mb-4">
          <motion.div
            className="absolute top-0 left-0 h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
          <img
            src="/loader/loaderMask.png"
            alt="Loader Mask"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-white text-lg font-medium"
        >
          Chargement...
        </motion.div>
      </div>
    </motion.div>
  );
}

function App() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const frameCount = 50;
  const fps = 30;

  useEffect(() => {
    if (loadingProgress >= 100) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500); // Attendre la fin du fade out
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  // Incrémenter le frameIndex à 30 fps uniquement si isPlaying, et s'arrêter à la dernière frame
  useEffect(() => {
    if (!isPlaying) return;
    if (frameIndex >= frameCount - 1) return;
    const id = setTimeout(() => setFrameIndex((f) => f + 1), 1000 / fps);
    return () => clearTimeout(id);
  }, [isPlaying, frameIndex]);

  const animationFinished = frameIndex >= frameCount - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* FullScreenLoader en dehors du Canvas */}
      {isLoading && <FullScreenLoader progress={loadingProgress} />}

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-coca-cola-red">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <img
              src="/logo/cocaColaLogo.webp"
              alt="Coca-Cola Logo"
              className="h-12 md:h-16"
            />
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-coca-cola-red/20 to-transparent"></div>
        {/* 3D Canvas */}
        <div className="three-container">
          <Canvas camera={{ position: [0, 1, 8], fov: 50 }} shadows>
            <Suspense fallback={<LoaderInCanvas />}>
              <LoadingProgress onProgress={setLoadingProgress} />
              {/* Éclairage */}
              <ambientLight intensity={0.3} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <pointLight position={[-5, 5, 5]} intensity={0.5} />

              {/* Modèle 3D de la bouteille */}
              <CocaColaBottle frameIndex={frameIndex} isPlaying={isPlaying} />

              {/* Animation de fluide */}
              <FluidAnimation frameIndex={frameIndex} />

              {/* Environnement */}
              <Environment preset="studio" />
            </Suspense>
          </Canvas>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6"
          >
            <span className="text-coca-cola-red">COCA</span>
            <span className="text-white">-</span>
            <span className="text-coca-cola-red">COLA</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-gray-300"
          >
            Découvrez le goût authentique de la boisson la plus célèbre au monde
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="coca-cola-button text-xl px-8 py-4"
            onClick={() => setIsPlaying(true)}
            disabled={isPlaying || animationFinished}
          >
            En savoir plus
          </motion.button>
        </div>
      </section>
    </div>
  );
}

export default App;
