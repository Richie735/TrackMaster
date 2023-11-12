import Product from "@/lib/models/product.model";
import { connectToDatabase } from "@/lib/mongoose";
import { generateEmailContent, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import {
   checkHighestPrice,
   checkLowestPrice,
   getAveragePrice,
   getEmailNotificationType,
} from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      connectToDatabase();

      const products = await Product.find({});
      if (!products) throw new Error("No products found");

      // Scrape product details and update
      const updatedProducts = await Promise.all(
         products.map(async (currentProduct) => {
            const scrapedProduct = await scrapeAmazonProduct(
               currentProduct.url
            );

            if (!scrapedProduct) throw new Error("No product found");

            const updatedPriceHistory = [
               ...currentProduct.priceHistory,
               {
                  price: scrapedProduct.currentPrice,
               },
            ];

            const product = {
               ...scrapedProduct,
               priceHistory: updatedPriceHistory,
               highestPrice: checkHighestPrice(updatedPriceHistory),
               lowestPrice: checkLowestPrice(updatedPriceHistory),
               averagePrice: getAveragePrice(updatedPriceHistory),
            };

            const updatedProduct = await Product.findOneAndUpdate(
               { url: scrapedProduct.url },
               product
            );

            // Check each product status and Email if needed
            const emailNotificationType = getEmailNotificationType(
               scrapedProduct,
               currentProduct
            );

            if (emailNotificationType && updatedProduct.users.length > 0) {
               const productInfo = {
                  title: updatedProduct.title,
                  url: updatedProduct.url,
               };

               const emailContent = await generateEmailContent(
                  productInfo,
                  emailNotificationType
               );

               const userEmails = updatedProduct.users.map(
                  (user: any) => user.email
               );

               await sendEmail(emailContent, userEmails);
            }

            return updatedProduct;
         })
      );
      return NextResponse.json({
         message: "OK",
         data: updatedProducts,
      });
   } catch (error) {
      throw new Error(`Error in GET: ${error}`);
   }
}
