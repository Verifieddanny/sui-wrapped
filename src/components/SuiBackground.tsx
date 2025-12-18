import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const SuiBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="fixed inset-0 z-0 bg-[#E1F0FF]" />;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-white">
      <div className="absolute inset-0 bg-linear-to-b from-[#E1F0FF] via-[#F2F8FF] to-white" />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -right-20 w-150 h-150 bg-[#4DA2FF] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
      />

      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute -bottom-32 -left-20 w-125 h-125 bg-[#3D5DD9] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
      />

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-[#4DA2FF] rounded-full opacity-30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: -100,
            x: `calc(${Math.random() * 100}px)`,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ width: 20 + Math.random() * 40, height: 20 + Math.random() * 40 }}
        />
      ))}
    </div>
  );
};