import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CategorySection } from "./components/CategorySection";
import { Cart, CartItem } from "./components/Cart";
import { Footer } from "./components/Footer";
import { AdminLogin } from "./components/AdminLogin";
import { AdminDashboard } from "./components/AdminDashboard";
import { Product } from "./components/ProductCard";

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Artisan Sourdough",
    description: "Classic sourdough bread with a crispy crust and tangy flavor. Perfect for sandwiches or toast.",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1728026918148-72bc0420373c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VyZG91Z2glMjBsb2FmfGVufDF8fHx8MTc2NTc3NzA0MXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "breads",
  },
  {
    id: 2,
    name: "Multigrain Loaf",
    description: "Hearty bread packed with whole grains and seeds. Nutritious and delicious.",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1627308593341-d886acdc06a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYnJlYWQlMjBiYWtlcnl8ZW58MXx8fHwxNzY1NzE1ODU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "breads",
  },
  {
    id: 3,
    name: "Fresh Baguette",
    description: "Traditional French baguette with a golden crust. Ideal for any meal or occasion.",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1686233964668-45a34531b750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWd1ZXR0ZSUyMGZyZW5jaCUyMGJyZWFkfGVufDF8fHx8MTc2NTcyNjU4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "breads",
  },
  {
    id: 4,
    name: "Rye Bread",
    description: "Traditional rye bread with a dense texture and rich flavor. Perfect for sandwiches.",
    price: 6.50,
    image: "https://images.unsplash.com/photo-1627308593341-d886acdc06a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYnJlYWQlMjBiYWtlcnl8ZW58MXx8fHwxNzY1NzE1ODU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "breads",
  },
  {
    id: 5,
    name: "Butter Croissants",
    description: "Flaky, buttery croissants made with traditional French technique. Fresh from the oven daily.",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1712723246766-3eaea22e52ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnl8ZW58MXx8fHwxNzY1NzA3NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "pastries",
  },
  {
    id: 6,
    name: "Chocolate Croissant",
    description: "Buttery croissant filled with premium dark chocolate. An indulgent breakfast treat.",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1712723246766-3eaea22e52ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnl8ZW58MXx8fHwxNzY1NzA3NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "pastries",
  },
  {
    id: 7,
    name: "Almond Danish",
    description: "Sweet pastry filled with almond cream and topped with sliced almonds.",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1712723246766-3eaea22e52ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnl8ZW58MXx8fHwxNzY1NzA3NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "pastries",
  },
  {
    id: 8,
    name: "Fruit Tart",
    description: "Delicate tart shell filled with vanilla custard and fresh seasonal fruits.",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1712723246766-3eaea22e52ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnl8ZW58MXx8fHwxNzY1NzA3NjU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "pastries",
  },
  {
    id: 9,
    name: "Cinnamon Buns",
    description: "Soft, gooey cinnamon rolls topped with cream cheese frosting. A customer favorite!",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1584966164218-42b0c3225e41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5uYW1vbiUyMGJ1bnN8ZW58MXx8fHwxNzY1Nzc3MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "buns",
  },
  {
    id: 10,
    name: "Sticky Buns",
    description: "Sweet rolls with caramel and pecans. Irresistibly sticky and delicious.",
    price: 6.50,
    image: "https://images.unsplash.com/photo-1584966164218-42b0c3225e41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5uYW1vbiUyMGJ1bnN8ZW58MXx8fHwxNzY1Nzc3MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "buns",
  },
  {
    id: 11,
    name: "Hot Cross Buns",
    description: "Spiced sweet buns with raisins and a cross on top. A seasonal favorite.",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1584966164218-42b0c3225e41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5uYW1vbiUyMGJ1bnN8ZW58MXx8fHwxNzY1Nzc3MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "buns",
  },
  {
    id: 12,
    name: "Burger Buns",
    description: "Soft, fluffy buns perfect for burgers and sandwiches. Pack of 6.",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1584966164218-42b0c3225e41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5uYW1vbiUyMGJ1bnN8ZW58MXx8fHwxNzY1Nzc3MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "buns",
  },
  {
    id: 13,
    name: "Everything Bagels",
    description: "Freshly baked bagels topped with sesame, poppy seeds, garlic, and onion. Pack of 6.",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1707144289499-8903dc4929c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWdlbHMlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzY1Nzc3MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "bagels",
  },
  {
    id: 14,
    name: "Plain Bagels",
    description: "Classic New York-style bagels. Simple and delicious. Pack of 6.",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1707144289499-8903dc4929c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWdlbHMlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzY1Nzc3MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "bagels",
  },
  {
    id: 15,
    name: "Sesame Bagels",
    description: "Toasted sesame seed bagels with a nutty flavor. Pack of 6.",
    price: 7.50,
    image: "https://images.unsplash.com/photo-1707144289499-8903dc4929c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWdlbHMlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzY1Nzc3MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "bagels",
  },
  {
    id: 16,
    name: "Cinnamon Raisin Bagels",
    description: "Sweet bagels with cinnamon and raisins. Perfect for breakfast. Pack of 6.",
    price: 8.50,
    image: "https://images.unsplash.com/photo-1707144289499-8903dc4929c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWdlbHMlMjBicmVha2Zhc3R8ZW58MXx8fHwxNzY1Nzc3MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "bagels",
  },
];

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
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

  const handleAddToCart = (product: Product) => {
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

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdminLogin = () => {
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleAddProduct = (product: Omit<Product, "id">) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleUpdateProduct = (id: number, product: Omit<Product, "id">) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...product } : p))
    );
  };

  const handleDeleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    // Also remove from cart if present
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const scrollToProducts = () => {
    document.getElementById("breads")?.scrollIntoView({ behavior: "smooth" });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Group products by category
  const categories = [
    { id: "breads", title: "Breads" },
    { id: "pastries", title: "Pastries" },
    { id: "buns", title: "Buns" },
    { id: "bagels", title: "Bagels" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onAdminClick={() => setIsAdminLoginOpen(true)}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
      />

      <main>
        <Hero onShopNow={scrollToProducts} />
        
        <div className="bg-white dark:bg-gray-900">
          {categories.map((category) => (
            <CategorySection
              key={category.id}
              id={category.id}
              title={category.title}
              products={products.filter((p) => p.category === category.id)}
              onAddToCart={handleAddToCart}
              loading={loading}
            />
          ))}
        </div>
      </main>

      <Footer />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
      />

      <AdminLogin
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLogin={handleAdminLogin}
      />

      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
}