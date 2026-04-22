import { Link } from "react-router-dom";

export function Footer({ showAdminLink = true, storeSettings }) {
  // Default values if storeSettings is not loaded yet
  const storeName = storeSettings?.storeName || "Bakery Store";
  const tagline = storeSettings?.tagline || "Freshly baked goods delivered daily";
  const email = storeSettings?.email || "contact@bakerystore.com";
  const phone = storeSettings?.phone || "(555) 123-4567";
  const address = storeSettings?.address || "123 Bakery Street";
  const city = storeSettings?.city || "New York, NY 10001";
  const mondayFriday = storeSettings?.mondayFriday || "6am - 8pm";
  const saturday = storeSettings?.saturday || "7am - 9pm";
  const sunday = storeSettings?.sunday || "7am - 6pm";

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground">🥖</span>
              </div>
              <span className="text-gray-900 dark:text-white">{storeName}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {tagline}
            </p>
            {showAdminLink && (
              <Link
                to="/admin/login"
                className="text-primary hover:text-primary/80 dark:text-accent dark:hover:text-accent/80 transition-colors text-sm"
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-900 dark:text-white mb-4">Contact</h4>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>{address}</p>
              <p>{city}</p>
              <p>{email}</p>
              <p>{phone}</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-gray-900 dark:text-white mb-4">Hours</h4>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>Monday - Friday: {mondayFriday}</p>
              <p>Saturday: {saturday}</p>
              <p>Sunday: {sunday}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 {storeName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
