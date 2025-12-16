import { motion } from "motion/react";

interface HeroProps {
  onShopNow: () => void;
}

export function Hero({ onShopNow }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 sm:py-32 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-xs"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-2xl">
              🥐
            </div>
            <div>
              <div className="text-gray-900 dark:text-white font-semibold">Fresh Daily</div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">Baked with care</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 max-w-xs"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <div className="text-gray-900 dark:text-white font-semibold">Premium Quality</div>
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            100% organic ingredients
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 dark:text-white mb-6 leading-tight">
            Freshly Baked Every Day
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
            Discover our artisanal selection of breads, buns, and pastries. 
            Handcrafted with love, baked fresh daily using traditional methods 
            and premium ingredients.
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
              className="bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:border-primary dark:hover:border-accent px-8 py-4 rounded-xl transition-colors min-w-[200px]"
            >
              View Products
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}