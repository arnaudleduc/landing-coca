import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 40); // 40ms = 25fps pour un chargement de 2 secondes

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setShouldRender(false);
        onComplete(); // Appeler la fonction callback
      }, 500); // Attendre la fin de l'animation fade out
      return () => clearTimeout(timer);
    }
  }, [isComplete, onComplete]);

  if (!shouldRender) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-coca-cola-red flex items-center justify-center z-50"
      animate={isComplete ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <div className="relative w-96 h-24 bg-coca-cola-red overflow-hidden mb-4">
          {/* Div blanche qui s'étend progressivement */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
          {/* Masque par-dessus */}
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
