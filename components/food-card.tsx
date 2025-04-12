"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/use-translation";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { FoodItem } from "@/types/food";

interface FoodCardProps {
  food: FoodItem;
}

export function FoodCard({ food }: FoodCardProps) {
  const { t } = useTranslation();
  const { addItem, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(food.id);

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={food.imageUrl || "/placeholder.svg?height=200&width=400"}
          alt={food.name}
          fill
          className="object-cover"
        />
        <Badge className="absolute top-2 right-2">
          {t(`food.categories.${food.category}`)}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{food.name}</span>
          <span className="text-lg">${food.price.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {food.description}
        </p>
        {food.quantity <= 5 && food.quantity > 0 && (
          <p className="text-sm text-yellow-500 mt-2">
            {t("food.lowStock", { count: food.quantity })}
          </p>
        )}
        {food.quantity === 0 && (
          <p className="text-sm text-destructive mt-2">
            {t("food.outOfStock")}
          </p>
        )}
      </CardContent>
      <CardFooter>
        {quantity === 0 ? (
          <Button
            className="w-full"
            onClick={() => addItem(food)}
            disabled={food.quantity === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {t("food.addToCart")}
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="icon"
              onClick={() => removeItem(food.id)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => addItem(food)}
              disabled={quantity >= food.quantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
