import { Product } from "@/lib/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, X } from "lucide-react";
import { useState } from "react";

interface ProductDetailProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetail({ product, open, onOpenChange }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 border-0 sm:border overflow-hidden h-full sm:h-auto sm:max-h-[85vh] rounded-none sm:rounded-lg">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-2 h-full sm:max-h-[85vh] overflow-y-auto">
          {/* Images */}
          <div className="bg-secondary p-8 flex flex-col gap-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-background">
              <img
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`h-16 w-16 rounded-lg overflow-hidden transition-all ${
                      selectedImage === idx
                        ? "ring-2 ring-foreground ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-8 flex flex-col">
            <div className="flex-1 space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {product.brand || product.category}
                </p>
                <h2 className="text-2xl font-semibold text-foreground leading-tight">
                  {product.title}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-foreground text-foreground" />
                    <span className="font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground text-sm">
                    {Math.floor(Math.random() * 500 + 50)} reviews
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold">${discountedPrice.toFixed(2)}</span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-success">
                      Save {Math.round(product.discountPercentage)}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Stock */}
              <p className={`text-sm font-medium ${product.stock > 10 ? "text-success" : "text-destructive"}`}>
                {product.stock > 10 ? "In Stock" : `Only ${product.stock} left`}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6 mt-6 border-t">
              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 h-12">
                  Add to Cart
                </Button>
                <Button className="flex-1 h-12">
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
