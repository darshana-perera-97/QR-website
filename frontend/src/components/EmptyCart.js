import { ShoppingBag } from "lucide-react";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="mb-2 text-gray-900 dark:text-white">Your cart is empty</h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-sm">
        Add some delicious bakery items to get started!
      </p>
    </div>
  );
}
