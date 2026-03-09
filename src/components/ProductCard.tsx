import { Product } from "@/lib/api";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <article
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary mb-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.discountPercentage > 10 && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium bg-foreground text-background rounded-full">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {product.brand || product.category}
        </p>
        
        <h3 className="font-medium text-foreground leading-snug line-clamp-1 group-hover:underline underline-offset-2">
          {product.title}
        </h3>

        <div className="flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
          <span className="text-sm text-foreground">{product.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
        </div>

        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-lg font-semibold text-foreground">
            ${discountedPrice.toFixed(0)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
