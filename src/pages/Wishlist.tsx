import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts, Product } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetail } from "@/components/ProductDetail";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

const Wishlist = () => {
  useEffect(() => { document.title = "Wishlist — Store"; }, []);
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
      <SiteHeader
        cartCount={totalItems}
        wishlistCount={wishlist.length}
        onOpenCart={() => setCartOpen(true)}
        backTo="/"
        backLabel="Back to shop"
      />

      {/* Main */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
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
