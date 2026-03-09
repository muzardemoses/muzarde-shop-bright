import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/ProductDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const { wishlist } = useWishlist();
  const { totalItems, setIsOpen: setCartOpen } = useCart();

  const { data } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(100),
  });

  const wishlistedProducts = data?.products.filter((p) => wishlist.includes(p.id)) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <a href="/" className="text-xl font-semibold tracking-tight">
                store<span className="text-muted-foreground">.</span>
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart className="h-4 w-4 fill-foreground" />
                {wishlist.length}
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
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Your Wishlist</h1>
          <p className="text-muted-foreground">
            {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Link to="/">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {wishlistedProducts.map((product, i) => (
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
      </main>

      <ProductDetail
        product={selectedProduct}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
};

export default Wishlist;
