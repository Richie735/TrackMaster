import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
   if (!url) return;

   // BrightData proxy configuration
   const username = String(process.env.BRIGHTDATA_USERNAME);
   const password = String(process.env.BRIGHTDATA_PASSWORD);
   const port = 22225;
   const session_id = Math.floor(Math.random() * 1000000) | 0;

   const options = {
      auth: {
         username: `${username}-session-${session_id}`,
         password,
      },
      host: "brd.superproxy.io",
      port,
      rejectUnauthorized: false,
   };

   try {
      // Fetch the product page
      const response = await axios.get(url, options);
      const $ = cheerio.load(response.data);

      // Extract the product data
      const title = $("#productTitle").text().trim();

      const currentPrice = extractPrice(
         $(".priceToPay span.a-price-whole"),
         $(".a.size.base.a-color-price"),
         $(".a-button-selected .a-color-base")
      );

      const originalPrice = extractPrice(
         $("#priceblock_ourprice"),
         $(".a-price.a-text-price span.a-offscreen"),
         $("#listPrice"),
         $("#priceblock_dealprice"),
         $(".a-size-base.a-color-price")
      );

      const outOfStock =
         $("#availability span").text().trim().toLowerCase() ===
         "currently unavailable";

      const images =
         $("#imgBlkFront").attr("data-a-dynamic-image") ||
         $("#landingImage").attr("data-a-dynamic-image") ||
         "{}";

      const imageUrls = Object.keys(JSON.parse(images));

      const currency = extractCurrency($(".a-price-symbol"));

      const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

      const description = extractDescription($);

      // Construct Data Object with the extracted data
      const data = {
         url,
         currency: currency || "€",
         image: imageUrls[0],
         title,
         category: "category", //TODO: add category
         numberOfReviews: 0, //TODO: add reviews
         rating: 0, //TODO: add rating
         description,
         isOutOfStock: outOfStock,
         currentPrice: Number(currentPrice) || Number(originalPrice),
         originalPrice: Number(originalPrice) || Number(currentPrice),
         priceHistory: [],
         highestPrice: Number(originalPrice) || Number(currentPrice),
         lowestPrice: Number(currentPrice) || Number(originalPrice),
         averagePrice: Number(currentPrice) || Number(originalPrice),
         discountRate: Number(discountRate),
      };

      return data;
   } catch (error: any) {
      console.log(error);
   }
}
