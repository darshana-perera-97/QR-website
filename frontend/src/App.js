import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage, initialProducts } from "./pages/HomePage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { StoreSettingsPage } from "./pages/StoreSettingsPage";
import { Cart } from "./components/Cart";

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdminLogin = () => {
    // Login handled in AdminLoginPage
  };

  const handleAddProduct = (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleUpdateProduct = (id, product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...product } : p))
    );
  };

  const handleDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from cart if present
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HomePage
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
                isDark={isDark}
                onThemeToggle={() => setIsDark(!isDark)}
                products={products}
                onAddToCart={handleAddToCart}
                loading={loading}
              />
              <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveFromCart}
              />
            </>
          }
        />
        <Route
          path="/admin/login"
          element={
            <AdminLoginPage
              cartCount={cartCount}
              onCartClick={() => setIsCartOpen(true)}
              isDark={isDark}
              onThemeToggle={() => setIsDark(!isDark)}
              onLogin={handleAdminLogin}
            />
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminDashboardPage
              cartCount={cartCount}
              onCartClick={() => setIsCartOpen(true)}
              isDark={isDark}
              onThemeToggle={() => setIsDark(!isDark)}
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          }
        />
        <Route
          path="/admin/settings"
          element={
            <StoreSettingsPage
              cartCount={cartCount}
              onCartClick={() => setIsCartOpen(true)}
              isDark={isDark}
              onThemeToggle={() => setIsDark(!isDark)}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
