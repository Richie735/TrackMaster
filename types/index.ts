export type PriceHistory = {
   price: number;
};

export type User = {
   email: string;
};

export type Product = {
   _id?: string;
   url: string;
   currency: string;
   images: string;
   title: string;
   category: string;
   numberOfReviews: number;
   rating: number;
   description: string;
   isOutOfStock: boolean;
   currentPrice: number;
   originalPrice: number;
   priceHistory: PriceHistory[] | [];
   highestPrice: number;
   lowestPrice: number;
   averagePrice: number;
   discountRate: number;
   users?: User[];
};
