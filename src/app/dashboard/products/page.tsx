import { Header } from "@/components/layout/header";
import { ProductsClient } from "@/components/products/products-client";
import { getProducts } from "@/lib/supabase/products";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <>
      <Header title="商品・講座管理" />
      <main className="flex-1 overflow-auto p-6">
        <ProductsClient initialProducts={products} />
      </main>
    </>
  );
}
