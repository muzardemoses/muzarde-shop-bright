import { Product } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  index?: number;
}

export function ProductCard({ product, onClick, index = 0 }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Card
      className="group relative cursor-pointer overflow-hidden border-0 bg-card shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Discount Badge */}
      {product.discountPercentage > 10 && (
        <div className="absolute left-3 top-3 z-10">
          <Badge className="gradient-warm border-0 px-3 py-1 font-semibold text-primary-foreground shadow-lg">
            -{Math.round(product.discountPercentage)}%
          </Badge>
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
        className={`absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-card/90 backdrop-blur-sm shadow-md transition-all duration-300 hover:scale-110 ${
          isLiked ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        <Heart className={`h-5 w-5 transition-all ${isLiked ? "fill-current" : ""}`} />
      </button>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-secondary">
        <img
          src={product.thumbnail}
          alt={product.title}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
        
        {/* Quick Add Button */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <Button
            className="w-full gradient-primary border-0 text-primary-foreground shadow-lg hover:opacity-90"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Category */}
        <Badge variant="secondary" className="mb-3 text-xs font-medium uppercase tracking-wider">
          {product.category}
        </Badge>

        {/* Title */}
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gradient">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
