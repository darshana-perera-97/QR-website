export function Footer() {
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
              <span className="text-gray-900 dark:text-white">Bakery Store</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Freshly baked goods delivered daily
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-gray-900 dark:text-white mb-4">Contact</h4>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>123 Bakery Street</p>
              <p>New York, NY 10001</p>
              <p>contact@bakerystore.com</p>
              <p>(555) 123-4567</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-gray-900 dark:text-white mb-4">Hours</h4>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <p>Monday - Friday: 6am - 8pm</p>
              <p>Saturday: 7am - 9pm</p>
              <p>Sunday: 7am - 6pm</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
          <p>© 2024 Bakery Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
