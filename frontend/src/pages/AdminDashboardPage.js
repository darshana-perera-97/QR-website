import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Edit2, Trash2, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Header } from "../components/Header";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function AdminDashboardPage({
  cartCount,
  onCartClick,
  isDark,
  onThemeToggle,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) {
  const navigate = useNavigate();
  const [storeSettings, setStoreSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "breads",
  });

  // Load store settings and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load store settings
        const settingsResponse = await fetch(`${API_BASE_URL}/api/store/settings`);
        const settingsData = await settingsResponse.json();

        if (settingsResponse.ok && settingsData.success) {
          setStoreSettings(settingsData.settings);
        }

        // Load categories
        const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`);
        const categoriesData = await categoriesResponse.json();

        if (categoriesResponse.ok && categoriesData.success) {
          setCategories(categoriesData.categories);
          // Set default category if formData.category is empty or doesn't exist in categories
          if (categoriesData.categories.length > 0) {
            const currentCategoryExists = categoriesData.categories.find(c => c.id === formData.category);
            if (!currentCategoryExists) {
              setFormData(prev => ({ ...prev, category: categoriesData.categories[0].id }));
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category,
    };

    if (editingId !== null) {
      onUpdateProduct(editingId, product);
    } else {
      onAddProduct(product);
    }

    const defaultCategory = categories.length > 0 ? categories[0].id : "breads";
    setFormData({ name: "", description: "", price: "", image: "", category: defaultCategory });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header
        cartCount={cartCount}
        onCartClick={onCartClick}
        onAdminClick={() => {}}
        isDark={isDark}
        onThemeToggle={onThemeToggle}
        showNavigation={false}
        onLogout={() => navigate("/admin/login")}
        storeSettings={storeSettings}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your products</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const defaultCategory = categories.length > 0 ? categories[0].id : "";
    setFormData({ name: "", description: "", price: "", image: "", category: defaultCategory });
                  setEditingId(null);
                  setShowForm(!showForm);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
              <button
                onClick={() => navigate("/admin/settings")}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Products table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">Image</th>
                      <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">Name</th>
                      <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">Description</th>
                      <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300">Price</th>
                      <th className="px-6 py-3 text-right text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4 text-gray-900 dark:text-white">{product.name}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {product.description}
                        </td>
                        <td className="px-6 py-4 text-gray-900 dark:text-white">
                          Rs. {product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(product.id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit/Add Product Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                const defaultCategory = categories.length > 0 ? categories[0].id : "";
    setFormData({ name: "", description: "", price: "", image: "", category: defaultCategory });
                setEditingId(null);
                setShowForm(false);
              }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-gray-900 dark:text-white text-lg font-semibold">
                    {editingId !== null ? "Edit Product" : "Add New Product"}
                  </h3>
                  <button
                    onClick={() => {
                      const defaultCategory = categories.length > 0 ? categories[0].id : "";
    setFormData({ name: "", description: "", price: "", image: "", category: defaultCategory });
                      setEditingId(null);
                      setShowForm(false);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Price
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                        required
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg transition-colors"
                    >
                      {editingId !== null ? "Update" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const defaultCategory = categories.length > 0 ? categories[0].id : "";
    setFormData({ name: "", description: "", price: "", image: "", category: defaultCategory });
                        setEditingId(null);
                        setShowForm(false);
                      }}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
