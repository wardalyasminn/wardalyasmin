import { getProducts, getCategories } from "@/lib/supabase-server";
import ProductsContent from "@/components/ProductsContent";

export default async function ProductsPage() {
  const [allProducts, categories] = await Promise.all([
      getProducts(),
          getCategories(),
            ]);

              const products = allProducts.filter((p) => p.is_available !== false);

                return <ProductsContent products={products} categories={categories} />;
                }