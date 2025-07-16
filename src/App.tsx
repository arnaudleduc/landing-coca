import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useProgress, Html } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { CocaColaBottle } from "./components/CocaColaBottle";
import * as THREE from "three";
import "./App.css";

// Composant pour contrôler la caméra
function CameraController({
  targetPosition,
  isTransitioning,
}: {
  targetPosition: [number, number, number];
  isTransitioning: boolean;
}) {
  const cameraRef = useRef<THREE.Camera | null>(null);
  const initialLookAt = useRef<THREE.Vector3 | null>(null);

  useFrame((state) => {
    if (!cameraRef.current) {
      cameraRef.current = state.camera;
      // Sauvegarder le lookAt initial
      initialLookAt.current = new THREE.Vector3();
      state.camera.getWorldDirection(initialLookAt.current);
      initialLookAt.current.multiplyScalar(10).add(state.camera.position);
    }

    if (isTransitioning && cameraRef.current && initialLookAt.current) {
      const camera = cameraRef.current;

      // Lerp vers la position cible
      camera.position.lerp(
        new THREE.Vector3(
          targetPosition[0],
          targetPosition[1],
          targetPosition[2]
        ),
        0.02 // Vitesse de transition
      );

      // Maintenir le lookAt initial
      camera.lookAt(initialLookAt.current);
    }
  });

  return null;
}

// Données des produits Coca-Cola
const products = [
  {
    id: "original",
    name: "Coca Cola Original",
    description: "Le goût classique et sucré, avec caféine",
    detailedDescription:
      "Découvrez la recette originale créée en 1886 par le Dr. John Pemberton. Cette boisson emblématique combine des extraits naturels de coca et de noix de kola avec des épices secrètes, créant un goût unique reconnu dans le monde entier. Avec sa teneur en caféine naturelle, Coca-Cola Original vous offre l'énergie et le plaisir authentique qui ont fait sa renommée depuis plus d'un siècle.",
    color: "coca-cola-red",
    texture: "/textures/cocaColaBottleDiffuse.png",
  },
  {
    id: "zero",
    name: "Coca Cola Zero",
    description: "Sans sucre, sans calories, avec caféine",
    detailedDescription:
      "Coca-Cola Zero Sugar vous offre le goût authentique de Coca-Cola sans les calories. Grâce à un mélange d'édulcorants naturels et artificiels, cette variante conserve le goût classique tout en s'adaptant aux modes de vie modernes. Parfaite pour ceux qui surveillent leur apport calorique sans vouloir renoncer au plaisir du Coca-Cola original.",
    color: "coca-cola-black",
    texture: "/textures/cocaColaZeroBottleDiffuse.png",
  },
  {
    id: "light",
    name: "Coca Cola Light",
    description: "Sans sucre, moins caféiné, goût plus léger",
    detailedDescription:
      "Coca-Cola Light propose une expérience plus douce avec moins de caféine que la version originale. Son goût rafraîchissant et léger en fait le choix idéal pour les moments de détente. Cette variante conserve l'essence du Coca-Cola tout en offrant une alternative plus subtile pour ceux qui préfèrent un goût moins intense.",
    color: "coca-cola-grey",
    texture: "/textures/cocaColaLightBottleDiffuse.png",
  },
  {
    id: "cherry",
    name: "Coca Cola Cherry",
    description: "Coca-Cola au goût cerise",
    detailedDescription:
      "Coca-Cola Cherry combine le goût classique de Coca-Cola avec une délicate note de cerise naturelle. Cette fusion créative offre une expérience gustative unique qui allie la familiarité du Coca-Cola original à la douceur fruitée de la cerise. Une boisson parfaite pour ceux qui aiment les saveurs audacieuses et innovantes.",
    color: "coca-cola-red",
    texture: "/textures/cocaColaCherryBottleDiffuse.png",
  },
  {
    id: "vanilla",
    name: "Coca Cola Vanilla",
    description: "Coca-Cola à l'arôme vanille",
    detailedDescription:
      "Coca-Cola Vanilla apporte une touche de douceur et de chaleur à la recette classique. L'arôme naturel de vanille se marie harmonieusement avec les épices secrètes du Coca-Cola, créant une expérience gustative réconfortante et sophistiquée. Une variante qui évoque les saveurs traditionnelles avec une modernité raffinée.",
    color: "coca-cola-sand",
    texture: "/textures/cocaColaVanillaBottleDiffuse.png",
  },
  {
    id: "lemon",
    name: "Coca Cola Lemon",
    description: "Coca-Cola avec une touche de citron",
    detailedDescription:
      "Coca-Cola Lemon ajoute une fraîcheur citronnée au goût emblématique de Coca-Cola. Cette combinaison rafraîchissante évoque les saveurs méditerranéennes et offre une expérience gustative vivifiante. Parfaite pour les journées chaudes ou pour ceux qui apprécient les notes acidulées et tonifiantes.",
    color: "coca-cola-yellow",
    texture: "/textures/cocaColaLemonBottleTextures.png",
  },
  {
    id: "lime",
    name: "Coca Cola Lime",
    description: "Coca-Cola avec une touche de citron vert",
    detailedDescription:
      "Coca-Cola Lime propose une expérience tropicale unique en combinant le goût classique de Coca-Cola avec la fraîcheur du citron vert. Cette variante évoque les saveurs exotiques et offre une alternative rafraîchissante qui transporte vos sens vers des destinations ensoleillées.",
    color: "coca-cola-green",
    texture: "/textures/cocaColaLimeBottleTextures.png",
  },
  {
    id: "orange",
    name: "Coca Cola Orange",
    description: "Coca-Cola saveur orange",
    detailedDescription:
      "Coca-Cola Orange fusionne le goût emblématique de Coca-Cola avec la douceur naturelle de l'orange. Cette combinaison fruitée crée une expérience gustative équilibrée qui allie la familiarité du Coca-Cola à la fraîcheur vitaminée de l'orange. Une boisson parfaite pour égayer vos journées.",
    color: "coca-cola-orange",
    texture: "/textures/cocaColaOrangeBottleDiffuse.png",
  },
  {
    id: "life",
    name: "Coca Cola Life",
    description:
      "Coca-Cola partiellement sucré avec du stevia, réduit en sucre",
    detailedDescription:
      "Coca-Cola Life représente l'innovation au service du bien-être. Cette variante utilise un mélange de sucre naturel et de stevia, un édulcorant naturel, pour réduire la teneur en sucre de 30% par rapport à la version originale. Une option plus équilibrée qui conserve le goût authentique de Coca-Cola tout en s'adaptant aux préoccupations nutritionnelles modernes.",
    color: "coca-cola-green",
    texture: "/textures/cocaColaLifeBottleDiffuse.png",
  },
];

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
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isCameraTransitioning, setIsCameraTransitioning] = useState(false);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const frameCount = 50;
  const fps = 30;

  const currentProduct = products[currentProductIndex];
  const targetCameraPosition: [number, number, number] = [7, 4.9, -5];
  const initialCameraPosition: [number, number, number] = [0, 1, 8];

  // Navigation circulaire
  const goToPrevious = () => {
    setCurrentProductIndex((prev) =>
      prev === 0 ? products.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentProductIndex((prev) =>
      prev === products.length - 1 ? 0 : prev + 1
    );
  };

  const handleLearnMore = () => {
    setIsPlaying(true);
    setIsCameraTransitioning(true);
    setShowDetailedView(true);
  };

  const handleReturn = () => {
    setIsCameraTransitioning(true);
    setShowDetailedView(false);
    setFrameIndex(0); // Remettre à l'état initial
    setIsPlaying(false); // Arrêter l'animation en cours
  };

  useEffect(() => {
    if (loadingProgress >= 100) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500); // Attendre la fin du fade out
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  // Gestion de l'animation forward
  useEffect(() => {
    if (!isPlaying) return;

    // Animation forward: frame 0 → 50
    if (frameIndex >= frameCount - 1) {
      setIsPlaying(false);
      return;
    }
    const id = setTimeout(() => setFrameIndex((f) => f + 1), 1000 / fps);
    return () => clearTimeout(id);
  }, [isPlaying, frameIndex, frameCount, fps]);

  const animationFinished = frameIndex >= frameCount - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* FullScreenLoader en dehors du Canvas */}
      {isLoading && <FullScreenLoader progress={loadingProgress} />}

      {/* Header */}
      <header
        className="fixed top-0 w-full z-50 transition-colors duration-500"
        style={{ backgroundColor: `var(--${currentProduct.color})` }}
      >
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

      {/* Chevrons de navigation */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-coca-cola-red text-white rounded-full p-3 transition-colors duration-200"
        style={{ fontSize: 36 }}
        aria-label="Produit précédent"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 6L9 12L15 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-coca-cola-red text-white rounded-full p-3 transition-colors duration-200"
        style={{ fontSize: 36 }}
        aria-label="Produit suivant"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 6L15 12L9 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

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
              <directionalLight position={[5, 5, 5]} intensity={1} />

              {/* Modèle 3D de la bouteille */}
              <CocaColaBottle
                frameIndex={frameIndex}
                isPlaying={isPlaying}
                texture={currentProduct.texture}
              />

              {/* Environnement */}
              <Environment preset="city" />

              <CameraController
                targetPosition={
                  showDetailedView
                    ? targetCameraPosition
                    : initialCameraPosition
                }
                isTransitioning={isCameraTransitioning}
              />
            </Suspense>
          </Canvas>
        </div>

        {/* Bloc de contenu de gauche */}
        <AnimatePresence mode="wait">
          {!showDetailedView && (
            <motion.div
              key="left-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute left-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 z-10 text-left text-white"
            >
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`title-${currentProduct.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  {currentProduct.name}
                </motion.h2>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${currentProduct.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-xl md:text-2xl mb-8 text-gray-300"
                >
                  {currentProduct.description}
                </motion.p>
              </AnimatePresence>

              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="coca-cola-button text-xl px-8 py-4"
                onClick={handleLearnMore}
                disabled={isPlaying || animationFinished}
              >
                En savoir plus
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bloc de contenu de droite */}
        <AnimatePresence mode="wait">
          {showDetailedView && (
            <motion.div
              key="right-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute right-1/3 w-1/3 translate-x-1/2 -translate-y-1/2 z-10 text-right text-white"
            >
              <AnimatePresence mode="wait">
                <motion.h2
                  key={`detailed-title-${currentProduct.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  {currentProduct.name}
                </motion.h2>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`detailed-desc-${currentProduct.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg md:text-xl mb-8 text-gray-300 leading-relaxed"
                >
                  {currentProduct.detailedDescription}
                </motion.p>
              </AnimatePresence>

              <motion.button
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="coca-cola-button text-xl px-8 py-4"
                onClick={handleReturn}
                disabled={isPlaying}
              >
                Retour
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

export default App;
