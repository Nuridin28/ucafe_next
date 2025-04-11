"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { createOrder } from "@/lib/api"
import { CartItem } from "@/components/cart-item"

export default function CartPage() {
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()

  const handleCheckout = async () => {
    if (items.length === 0) return

    setLoading(true)
    try {
      const orderData = {
        items: items.map((item) => ({
          foodId: item.id,
          quantity: item.quantity,
        })),
      }

      const { orderId, orderNumber } = await createOrder(orderData)

      toast({
        title: t("cart.orderSuccess"),
        description: t("cart.orderSuccessMessage", { orderNumber }),
      })

      clearCart()
      router.push(`/user/orders/${orderId}`)
    } catch (error) {
      toast({
        title: t("cart.orderError"),
        description: t("cart.orderErrorMessage"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{t("cart.title")}</h1>

      {items.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">{t("cart.empty")}</p>
              <Button variant="outline" className="mt-4" onClick={() => router.push("/user")}>
                {t("cart.continueShopping")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("cart.yourItems")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}

            <Separator className="my-4" />

            <div className="flex justify-between font-medium text-lg">
              <span>{t("cart.total")}</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleCheckout} disabled={loading}>
              {loading ? t("cart.processing") : t("cart.checkout")}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
