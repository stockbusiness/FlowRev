import { Header } from "@/components/layout/header";
import { CategoriesClient } from "@/components/categories/categories-client";
import { getCategories } from "@/lib/supabase/categories";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <Header title="カテゴリ管理" />
      <main className="flex-1 overflow-auto p-6">
        <CategoriesClient initialCategories={categories} />
      </main>
    </>
  );
}
