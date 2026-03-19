import { ChangeEvent, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  backTo?: string;
  backLabel?: string;
  className?: string;
}

export function SiteHeader({
  cartCount,
  wishlistCount,
  onOpenCart,
  searchValue,
  onSearchChange,
  backTo,
  backLabel = "Back",
  className,
}: SiteHeaderProps) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const showSearch = typeof searchValue === "string" && typeof onSearchChange === "function";

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(event.target.value);
  };

  const handleSignIn = () => {
    toast.info("Sign in is not connected yet. You can keep browsing and using the cart for now.");
    setMenuOpen(false);
  };

  const handleOpenCart = () => {
    onOpenCart();
    setMenuOpen(false);
  };

  const isWishlistPage = location.pathname === "/wishlist";

  return (
    <header className={cn("sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl", className)}>
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            {backTo ? (
              <Button variant="ghost" size="icon" asChild>
                <Link to={backTo} aria-label={backLabel}>
                  <span aria-hidden="true">←</span>
                </Link>
              </Button>
            ) : null}
            <Link to="/" className="min-w-0">
              <span className="block truncate text-lg font-semibold tracking-tight sm:text-xl">
                Muzarde <span className="text-muted-foreground">Store</span>
              </span>
            </Link>
          </div>

          {showSearch ? (
            <div className="order-3 w-full md:order-none md:flex-1 md:min-w-[16rem] md:max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products, brands, categories..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="h-10 border-0 bg-secondary pl-10 focus-visible:ring-1"
                />
              </div>
            </div>
          ) : (
            <div className="hidden md:block md:flex-1" />
          )}

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button variant={isWishlistPage ? "secondary" : "ghost"} size="icon" asChild className="sm:hidden">
              <Link to="/wishlist" aria-label={`Wishlist (${wishlistCount})`}>
                <Heart className={cn("h-4 w-4", isWishlistPage && "fill-foreground")} />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={handleOpenCart} aria-label={`Cart (${cartCount})`}>
              <ShoppingBag className="h-4 w-4" />
            </Button>

            <Link to="/wishlist" className="hidden sm:block">
              <Button variant={isWishlistPage ? "secondary" : "ghost"} size="sm" className="gap-2">
                <Heart className={cn("h-4 w-4", isWishlistPage && "fill-foreground")} />
                Wishlist ({wishlistCount})
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="hidden gap-2 sm:inline-flex" onClick={handleSignIn}>
              <User className="h-4 w-4" />
              Sign in
            </Button>
            <Button size="sm" className="hidden gap-2 sm:inline-flex" onClick={handleOpenCart}>
              <ShoppingBag className="h-4 w-4" />
              Cart ({cartCount})
            </Button>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs">
                <SheetHeader>
                  <SheetTitle>Muzarde Store</SheetTitle>
                  <SheetDescription>Quick links and account actions.</SheetDescription>
                </SheetHeader>

                <div className="mt-8 flex flex-col gap-3">
                  <SheetClose asChild>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/">Home</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button variant="outline" className="justify-start" asChild>
                      <Link to="/wishlist">Wishlist ({wishlistCount})</Link>
                    </Button>
                  </SheetClose>
                  <Button variant="outline" className="justify-start" onClick={handleOpenCart}>
                    Cart ({cartCount})
                  </Button>
                  <Button className="justify-start" onClick={handleSignIn}>
                    Sign in
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
