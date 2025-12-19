import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const SuiBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="fixed inset-0 z-0 bg-[#E1F0FF]" />;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-white pointer-events-none">
      <div className="absolute inset-0 bg-linear-to-b from-[#E1F0FF] via-[#F2F8FF] to-white" />

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -right-10 w-80 h-80 bg-[#4DA2FF] rounded-full mix-blend-multiply filter blur-2xl opacity-20 will-change-transform"
      />

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-[#4DA2FF] rounded-full opacity-20 blur-xl will-change-transform"
          initial={{
            x: `${10 + i * 30}%`,
            y: "110%",
          }}
          animate={{
            y: "-10%",
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
          style={{ width: 40 + i * 20, height: 40 + i * 20 }}
        />
      ))}
    </div>
  );
};