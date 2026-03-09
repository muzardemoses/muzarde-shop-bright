import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, searchProducts, getCategories, Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/ProductDetail";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Sparkles, ShoppingBag, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", search, category],
    queryFn: () => {
      if (search) return searchProducts(search);
      return getProducts(30, 0, category === "all" ? undefined : category);
    },
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.1)_0%,transparent_50%)]" />
        
        <div className="relative container mx-auto px-4 py-12 lg:py-20">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Logo & Title */}
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <ShoppingBag className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent animate-pulse-soft" />
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold">
                <span className="text-gradient">Product</span>
                <span className="text-foreground">Hub</span>
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-lg text-muted-foreground max-w-md animate-fade-in" style={{ animationDelay: "100ms" }}>
              Discover amazing products at unbeatable prices
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 lg:gap-10 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="font-medium">10K+ Products</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-medium">Top Brands</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-5 w-5 text-amber-500" />
                <span className="font-medium">Fast Delivery</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-card shadow-xl border border-border">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search for products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-12 pl-12 border-0 bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 w-full sm:w-[180px] border-0 bg-secondary rounded-xl">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="h-12 px-8 gradient-primary text-primary-foreground border-0 rounded-xl font-semibold shadow-lg shadow-primary/30 hover:opacity-90 transition-all">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Results Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {search ? `Results for "${search}"` : category !== "all" ? category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ") : "Featured Products"}
            </h2>
            <p className="mt-1 text-muted-foreground">
              {data?.total ?? 0} products found
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4 animate-shimmer rounded-2xl p-4">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data?.products.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <ProductCard
                  product={product}
                  onClick={() => handleProductClick(product)}
                  index={index}
                />
              </div>
            ))}
          </div>
        )}

        {data?.products.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">
              No products found
            </h3>
            <p className="mt-2 text-muted-foreground max-w-sm">
              Try adjusting your search or filter to find what you're looking for
            </p>
            <Button
              variant="outline"
              className="mt-6"
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

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground">ProductHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 ProductHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <ProductDetail
        product={selectedProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
};

export default Index;
