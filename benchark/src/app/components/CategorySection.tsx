import { ProductCard, Product } from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";

interface CategorySectionProps {
  id: string;
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  loading: boolean;
}

export function CategorySection({ id, title, products, onAddToCart, loading }: CategorySectionProps) {
  return (
    <section id={id} className="py-12 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-gray-900 dark:text-white mb-8">{title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
        </div>
      </div>
    </section>
  );
}
