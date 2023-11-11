"use server";

import { connectToDatabase } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndSaveProduct(productUrl: string) {
   if (!productUrl) return;

   try {
      connectToDatabase();

      const scrapedProduct = await scrapeAmazonProduct(productUrl);

      if (!scrapedProduct) return;
   } catch (error: any) {
      throw new Error("Failed to create/update product: ${error.message}");
   }
}
