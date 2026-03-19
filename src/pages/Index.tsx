import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, searchProducts, getCategories, Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/ProductDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

const Index = () => {
  // Update document title based on active category
  const updateTitle = (cat: string) => {
    document.title = cat === "all" 
      ? "Store — Shop Top Products Online" 
      : `${cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " ")} — Store`;
  };
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating-desc">("featured");
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    updateTitle(cat);
  };
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { totalWishlist } = useWishlist();

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
  const sortedProducts = [...(data?.products ?? [])].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating-desc") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        cartCount={totalItems}
        wishlistCount={totalWishlist}
        onOpenCart={() => setCartOpen(true)}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* Main */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2">
            <button
              onClick={() => handleCategoryChange("all")}
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
                onClick={() => handleCategoryChange(cat)}
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
              <Button variant="outline" size="sm" className="w-full gap-2 sm:w-auto shrink-0">
                <SlidersHorizontal className="h-4 w-4" />
                Sort products
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("featured")}>Featured</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-asc")}>Price: Low to High</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("price-desc")}>Price: High to Low</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("rating-desc")}>Highest Rated</DropdownMenuItem>
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
            {sortedProducts.map((product, i) => (
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
        {sortedProducts.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No products found</p>
            <Button
              variant="link"
              onClick={() => {
                setSearch("");
                handleCategoryChange("all");
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
