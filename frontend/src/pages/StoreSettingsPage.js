import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Save, Plus, Trash2, Upload, X } from "lucide-react";
import { Header } from "../components/Header";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export function StoreSettingsPage({
  cartCount,
  onCartClick,
  isDark,
  onThemeToggle,
}) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    storeName: "Bakery Store",
    tagline: "Freshly baked goods delivered daily",
    email: "contact@bakerystore.com",
    phone: "(555) 123-4567",
    address: "123 Bakery Street",
    city: "New York, NY 10001",
    mondayFriday: "6am - 8pm",
    saturday: "7am - 9pm",
    sunday: "7am - 6pm",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [categorySuccess, setCategorySuccess] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);

  // Load settings and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load store settings
        const settingsResponse = await fetch(`${API_BASE_URL}/api/store/settings`);
        const settingsData = await settingsResponse.json();

        if (settingsResponse.ok && settingsData.success) {
          setSettings(settingsData.settings);
          // Set icon preview if icon exists
          if (settingsData.settings.icon) {
            setIconPreview(`${API_BASE_URL}${settingsData.settings.icon}`);
          }
        } else {
          setError('Failed to load settings. Using defaults.');
        }

        // Load categories
        const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`);
        const categoriesData = await categoriesResponse.json();

        if (categoriesResponse.ok && categoriesData.success) {
          setCategories(categoriesData.categories);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to connect to server. Using default settings.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/store/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('Settings saved successfully!');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCategoryError("");
    setCategorySuccess("");

    if (!newCategoryName || !newCategoryName.trim()) {
      setCategoryError("Category name is required");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCategories([...categories, data.category]);
        setNewCategoryName("");
        setCategorySuccess('Category added successfully!');
        setTimeout(() => setCategorySuccess(""), 3000);
      } else {
        setCategoryError(data.error || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setCategoryError('Failed to connect to server. Please try again.');
    }
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIconFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconUpload = async () => {
    if (!iconFile) {
      setError("Please select an image file");
      return;
    }

    setIsUploadingIcon(true);
    setError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append('icon', iconFile);

      const response = await fetch(`${API_BASE_URL}/api/store/icon`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage('Icon uploaded successfully!');
        setIconFile(null);
        // Update settings with new icon path
        setSettings(prev => ({ ...prev, icon: data.icon }));
        setIconPreview(`${API_BASE_URL}${data.icon}`);
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.error || 'Failed to upload icon');
      }
    } catch (error) {
      console.error('Error uploading icon:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsUploadingIcon(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm(`Are you sure you want to delete the category "${categoryId}"?`)) {
      return;
    }

    setCategoryError("");
    setCategorySuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCategories(categories.filter(c => c.id !== categoryId));
        setCategorySuccess('Category deleted successfully!');
        setTimeout(() => setCategorySuccess(""), 3000);
      } else {
        setCategoryError(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setCategoryError('Failed to connect to server. Please try again.');
    }
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
        storeSettings={settings}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Store Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your store information and preferences
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
              <div className="text-gray-600 dark:text-gray-400">Loading settings...</div>
            </div>
          ) : (
            <div className="p-6">
              {error && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
              {/* Store Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Store Information
                </h2>
                <div className="space-y-4">
                  {/* Store Icon */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Store Icon
                    </label>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {iconPreview ? (
                          <div className="relative">
                            <img
                              src={iconPreview}
                              alt="Store icon"
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIconFile(null);
                                setIconPreview(settings.icon ? `${API_BASE_URL}${settings.icon}` : null);
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                            <span className="text-3xl">🥖</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleIconChange}
                          className="hidden"
                          id="icon-upload"
                        />
                        <label
                          htmlFor="icon-upload"
                          className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer mb-2"
                        >
                          <Upload className="w-4 h-4 inline mr-2" />
                          Choose Image
                        </label>
                        {iconFile && (
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={handleIconUpload}
                              disabled={isUploadingIcon}
                              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              {isUploadingIcon ? "Uploading..." : "Upload Icon"}
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Recommended: Square image, max 5MB (JPG, PNG, GIF, WebP, SVG)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => handleChange("storeName", e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => handleChange("tagline", e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      City & State
                    </label>
                    <input
                      type="text"
                      value={settings.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Store Hours */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Store Hours
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Monday - Friday
                    </label>
                    <input
                      type="text"
                      value={settings.mondayFriday}
                      onChange={(e) => handleChange("mondayFriday", e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Saturday
                    </label>
                    <input
                      type="text"
                      value={settings.saturday}
                      onChange={(e) => handleChange("saturday", e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Sunday
                    </label>
                    <input
                      type="text"
                      value={settings.sunday}
                      onChange={(e) => handleChange("sunday", e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard")}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>

          {/* Categories Management - Outside the main form */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Food Categories
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Manage product categories. Categories with products cannot be deleted.
              </p>

              {categoryError && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {categoryError}
                </div>
              )}
              {categorySuccess && (
                <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
                  {categorySuccess}
                </div>
              )}

              {/* Add New Category Form */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Add New Category
                </h3>
                <form onSubmit={handleAddCategory} className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g., Desserts"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </form>
              </div>

              {/* Categories List */}
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {category.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        ID: {category.id}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                ))}
                {categories.length === 0 && (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    No categories found. Add your first category above.
                  </div>
                )}
              </div>
            </div>
          </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
