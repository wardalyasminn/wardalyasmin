import { getProducts, getCategories, getSettings } from "@/lib/supabase-server";
import HomeContent from "@/components/HomeContent";

export default async function HomePage() {
  const [allProducts, categories, settings] = await Promise.all([
      getProducts(),
          getCategories(),
              getSettings(),
                ]);

                  const products = allProducts.filter((p) => p.is_available !== false);

                    return <HomeContent products={products} categories={categories} settings={settings as unknown as Record<string, string>} />;
                    }