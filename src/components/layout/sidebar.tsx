"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, BarChart3, BookOpen, Building2, FileText, Home, RefreshCw, Settings, Tag, TrendingUp, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",              label: "概要",          icon: Home },
  { href: "/dashboard/products",     label: "商品・講座管理", icon: BookOpen },
  { href: "/dashboard/customers",    label: "顧客管理",       icon: Building2 },
  { href: "/dashboard/transactions", label: "取引管理",       icon: ArrowLeftRight },
  { href: "/dashboard/categories",   label: "カテゴリ管理",   icon: Tag },
  { href: "/dashboard/reports",      label: "レポート",       icon: TrendingUp },
  { href: "/dashboard/analytics",    label: "収益分析",       icon: BarChart3 },
  { href: "/dashboard/budgets",      label: "予算管理",       icon: Wallet },
  { href: "/dashboard/invoices",     label: "請求書",         icon: FileText },
  { href: "/dashboard/settings",     label: "設定",           icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 shrink-0 border-r bg-card h-full flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-primary" />
          <span className="font-bold">FlowRev</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
