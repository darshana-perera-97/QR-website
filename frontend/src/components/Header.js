import { ShoppingCart, Moon, Sun, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function Header({ cartCount, onCartClick, onAdminClick, isDark, onThemeToggle, showNavigation = true, onLogout, storeSettings }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await response.json();

        if (response.ok && data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    if (showNavigation) {
      loadCategories();
    }
  }, [showNavigation]);

  // Default store name if storeSettings is not loaded yet
  const storeName = storeSettings?.storeName || "Bakery Store";

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {storeSettings?.icon ? (
              <img
                src={`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${storeSettings.icon}`}
                alt={storeName}
                className="w-10 h-10 object-cover rounded-lg"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  e.target.style.display = 'none';
                  const fallback = e.target.parentElement.querySelector('.icon-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className={`w-10 h-10 bg-primary rounded-lg flex items-center justify-center icon-fallback ${storeSettings?.icon ? 'hidden' : ''}`}
            >
              <span className="text-primary-foreground">🥖</span>
            </div>
            <span className="text-gray-900 dark:text-white">{storeName}</span>
          </Link>

          {/* Navigation */}
          {showNavigation && (
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-accent transition-colors">
                Home
              </Link>
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/#${category.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    // Navigate to home if not already there
                    if (window.location.pathname !== '/') {
                      navigate('/');
                      // Wait for navigation, then scroll
                      setTimeout(() => {
                        const element = document.getElementById(category.id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    } else {
                      // Already on home page, just scroll
                      const element = document.getElementById(category.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                  }}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-accent transition-colors"
                >
                  {category.name}
                </a>
              ))}
            </nav>
          )}

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

            {showNavigation && (
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
            )}

            {!showNavigation && onLogout && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (onLogout) {
                    onLogout();
                  } else {
                    navigate("/admin/login");
                  }
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
