"use client"

import Image from "next/image"
import { useTranslation } from "@/hooks/use-translation"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import type { CartItemType } from "@/hooks/use-cart"
import { Trash, Plus, Minus } from "lucide-react"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { t } = useTranslation()
  const { updateItemQuantity, removeItem } = useCart()

  return (
    <div className="flex items-center space-x-4">
      <div className="relative h-16 w-16 rounded-md overflow-hidden">
        <Image
          src={item.imageUrl || "/placeholder.svg?height=64&width=64"}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium">{item.name}</h4>
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
          disabled={item.quantity >= item.maxQuantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-right min-w-[60px]">${(item.price * item.quantity).toFixed(2)}</div>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.id)}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  )
}
