import { PriceHistory } from "@/types";

// Extract and return the price
export function extractPrice(...elements: any) {
   for (const element of elements) {
      const priceText = element.text().trim();

      if (priceText) {
         const cleanPrice = priceText.replace(/[^\d.]/g, "");

         let firstPrice;

         if (cleanPrice) {
            firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
         }

         return firstPrice || cleanPrice;
      }
   }

   return "";
}

// Extract and return th currency
export function extractCurrency(element: any) {
   const currencyText = element.text().trim().slice(0, 1);
   return currencyText ? currencyText : "";
}

// Extracts the Amazon description
export function extractDescription($: any) {
   const selectors = [
      ".a-unordered-list .a-list-item",
      ".a-expander-content p",
   ];

   for (const selector of selectors) {
      const elements = $(selector);
      if (elements.length > 0) {
         const textContent = elements
            .map((_: any, element: any) => $(element).text().trim())
            .get()
            .join("\n");
         return textContent;
      }
   }

   return "";
}

// Check the price history for the highest
export function checkHighestPrice(priceHistory: PriceHistory[]) {
   let highestPrice = priceHistory[0];

   for (let i = 0; i < priceHistory.length; i++) {
      if (priceHistory[i].price > highestPrice.price) {
         highestPrice = priceHistory[i];
      }
   }

   return highestPrice.price;
}

// Check the price history for the lowest
export function checkLowestPrice(priceHistory: PriceHistory[]) {
   let lowestPrice = priceHistory[0];

   for (let i = 0; i < priceHistory.length; i++) {
      if (priceHistory[i].price < lowestPrice.price) {
         lowestPrice = priceHistory[i];
      }
   }

   return lowestPrice.price;
}

// Calculate the average price
export function getAveragePrice(priceHistory: PriceHistory[]) {
   const sum = priceHistory.reduce((acc, curr) => acc + curr.price, 0);
   const average = sum / priceHistory.length;

   return average;
}

export const formatNumber = (num: number = 0) => {
   return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   });
};
