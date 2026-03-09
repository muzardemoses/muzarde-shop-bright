import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CheckCircle2, Tag } from "lucide-react";
import { toast } from "sonner";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zipCode: z.string().min(3, "ZIP code is required"),
  cardNumber: z.string().min(16, "Invalid card number").max(19, "Invalid card number"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format: MM/YY"),
  cvc: z.string().min(3, "Invalid CVC").max(4, "Invalid CVC"),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutValues) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Payment successful!");
    clearCart();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-24 w-24 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. We'll send you an email with your order details shortly.
          </p>
          <Button className="w-full" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Add some items to your cart to checkout.</p>
          <Button onClick={() => navigate("/")}>Return to Store</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto py-4 px-4 flex items-center">
          <Link to="/">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <span className="text-xl font-semibold tracking-tight">Checkout</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Form Section */}
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Contact Info */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register("firstName")} />
                    {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register("lastName")} />
                    {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                </div>
              </section>

              <Separator />

              {/* Shipping Info */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" {...register("address")} />
                    {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" {...register("city")} />
                      {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input id="zipCode" {...register("zipCode")} />
                      {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode.message}</p>}
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Payment Info */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Payment Details (Demo)</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" {...register("cardNumber")} />
                    {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" {...register("expiry")} />
                      {errors.expiry && <p className="text-sm text-destructive">{errors.expiry.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" {...register("cvc")} />
                      {errors.cvc && <p className="text-sm text-destructive">{errors.cvc.message}</p>}
                    </div>
                  </div>
                </div>
              </section>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 bg-secondary/50 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => {
                const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100);
                return (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-background shrink-0">
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-2">{item.product.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">
                      ${(discountedPrice * item.quantity).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              form="checkout-form" 
              className="w-full h-12 text-lg" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              This is a demo checkout. No actual charges will be made.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
