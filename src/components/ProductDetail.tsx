import { Product } from "@/lib/api";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Package, Heart, Truck, Shield, RotateCcw } from "lucide-react";
import { useState } from "react";

interface ProductDetailProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetail({
  product,
  open,
  onOpenChange,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-0 shadow-2xl">
        <div className="grid md:grid-cols-2">
          {/* Image Gallery */}
          <div className="relative bg-gradient-to-br from-secondary to-muted p-6">
            <div className="sticky top-0 space-y-4">
              <div className="aspect-square overflow-hidden rounded-2xl bg-card shadow-lg">
                <img
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.title}
                  className="h-full w-full object-cover animate-fade-in"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                        selectedImage === idx
                          ? "border-primary shadow-lg shadow-primary/20 scale-105"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="gradient-primary border-0 text-primary-foreground">
                  {product.category}
                </Badge>
                {product.brand && (
                  <Badge variant="outline" className="font-medium">
                    {product.brand}
                  </Badge>
                )}
              </div>
              
              <h2 className="font-display text-3xl font-bold text-foreground">
                {product.title}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-foreground">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {Math.floor(Math.random() * 500) + 50} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2 py-4 border-y border-border">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-gradient">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <Badge variant="destructive" className="text-sm">
                      Save {Math.round(product.discountPercentage)}%
                    </Badge>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-accent">
                <Package className="h-4 w-4" />
                <span className="font-medium">
                  {product.stock > 10
                    ? "In Stock"
                    : product.stock > 0
                    ? `Only ${product.stock} left!`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-foreground">Quantity:</span>
              <div className="flex items-center rounded-xl border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  −
                </button>
                <span className="px-4 py-2 font-semibold text-foreground min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                size="lg"
                className="flex-1 h-14 text-lg font-semibold gradient-primary border-0 text-primary-foreground shadow-lg shadow-primary/30 hover:opacity-90 transition-all"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`h-14 w-14 ${isLiked ? "text-destructive border-destructive" : ""}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="flex flex-col items-center gap-2 text-center p-3 rounded-xl bg-secondary">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center p-3 rounded-xl bg-secondary">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center p-3 rounded-xl bg-secondary">
                <RotateCcw className="h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
