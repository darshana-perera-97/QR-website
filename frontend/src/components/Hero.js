import { motion } from "motion/react";

export function Hero({ onShopNow, storeSettings }) {
  // Default values if storeSettings is not loaded yet
  const storeName = storeSettings?.storeName || "Bakery Store";
  const tagline = storeSettings?.tagline || "Freshly baked goods delivered daily";

  return (
    <section 
      className="relative py-20 sm:py-32 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80')"
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight font-bold drop-shadow-lg">
            Welcome to {storeName}
          </h1>
          <p className="text-lg sm:text-xl text-gray-100 dark:text-gray-200 mb-10 max-w-3xl mx-auto drop-shadow-md">
            {tagline}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShopNow}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl min-w-[200px]"
            >
              Shop Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("breads")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl transition-colors min-w-[200px]"
            >
              View Products
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
