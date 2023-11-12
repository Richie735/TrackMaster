export type PriceHistory = {
   price: number;
   date?: Date;
};

export type User = {
   email: string;
};

export type Product = {
   _id?: string;
   url: string;
   currency: string;
   image: string;
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

export type NotificationType =
   | "WELCOME"
   | "CHANGE_OF_STOCK"
   | "LOWEST_PRICE"
   | "THRESHOLD_MET";

export type EmailContent = {
   subject: string;
   body: string;
};

export type EmailProductInfo = {
   title: string;
   url: string;
};
