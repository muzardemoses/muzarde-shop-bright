import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, searchProducts, getCategories, Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/ProductDetail";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal, ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/contexts/CartContext";

const Index = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", search, category],
    queryFn: () => {
      if (search) return searchProducts(search);
      return getProducts(24, 0, category === "all" ? undefined : category);
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <a href="/" className="text-xl font-semibold tracking-tight">
              store<span className="text-muted-foreground">.</span>
            </a>

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 bg-secondary border-0 focus-visible:ring-1"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
              <Button size="sm" className="gap-2" onClick={() => setCartOpen(true)}>
                <ShoppingBag className="h-4 w-4" />
                Cart ({totalItems})
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto py-8">
        {/* Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
            <button
              onClick={() => setCategory("all")}
              className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                category === "all"
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              All
            </button>
            {categories?.slice(0, 8).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ")}
              </button>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
              <DropdownMenuItem>Highest Rated</DropdownMenuItem>
              <DropdownMenuItem>Most Popular</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {data?.total ?? 0} products
        </p>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-2xl" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {data?.products.map((product, i) => (
              <div
                key={product.id}
                className="animate-in"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <ProductCard
                  product={product}
                  onClick={() => {
                    setSelectedProduct(product);
                    setDetailOpen(true);
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {data?.products.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No products found</p>
            <Button
              variant="link"
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>

      {/* Product Detail */}
      <ProductDetail
        product={selectedProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
};

export default Index;
