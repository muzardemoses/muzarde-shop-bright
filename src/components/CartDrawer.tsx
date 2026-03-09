import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button variant="link" onClick={() => setIsOpen(false)}>
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => {
                  const discountedPrice =
                    item.product.price * (1 - item.product.discountPercentage / 100);
                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-4 pb-4 border-b last:border-0"
                    >
                      <div className="h-20 w-20 rounded-lg overflow-hidden bg-secondary shrink-0">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-snug line-clamp-2">
                          {item.product.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          ${discountedPrice.toFixed(2)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <Button className="w-full h-12">Checkout</Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
