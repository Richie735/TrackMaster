export type PriceHistory = {
   price: number;
};

export type Product = {
   _id?: string;
   url: string;
   currency: string;
   images: string;
   title: string;
   description: string;
   isOutOfStock: boolean;
   currentPrice: number;
   originalPrice: number;
   priceHistory: PriceHistory[] | [];
   highestPrice: number;
   lowestPrice: number;
   averagePrice: number;
   discountRate: number;
};
