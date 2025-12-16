import { ShoppingCart, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Header({ cartCount, onCartClick, onAdminClick, isDark, onThemeToggle }: HeaderProps) {
  const categories = [
    { name: "Breads", href: "#breads" },
    { name: "Pastries", href: "#pastries" },
    { name: "Buns", href: "#buns" },
    { name: "Bagels", href: "#bagels" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground">🥖</span>
            </div>
            <span className="text-gray-900 dark:text-white">Bakery Store</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-accent transition-colors">
              Home
            </a>
            {categories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
              >
                {category.name}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="View cart"
            >
              <ShoppingCart className="w-5 h-5 text-gray-900 dark:text-white" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent text-white w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            <button
              onClick={onAdminClick}
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}