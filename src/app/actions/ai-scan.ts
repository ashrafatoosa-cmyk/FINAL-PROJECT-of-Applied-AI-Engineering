"use server";

import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeInventory(fileData: string, mimeType: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured in .env.local");
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            items: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING },
                  category: { type: SchemaType.STRING },
                  quantity: { type: SchemaType.NUMBER },
                  isFragile: { type: SchemaType.BOOLEAN },
                  m3: { type: SchemaType.NUMBER },
                },
                required: ["name", "category", "quantity", "isFragile", "m3"],
              },
            },
            totalVolume: { type: SchemaType.NUMBER },
            summary: { type: SchemaType.STRING },
          },
          required: ["items", "totalVolume", "summary"],
        },
      },
    });

    const prompt = `
      Act as a professional inventory analyst for a premium moving company 'MoveMate Pro'.
      Analyze the provided video or image of a room/apartment.
      
      Task:
      1. Identify all furniture and items visible.
      2. Group them into categories: Furniture, Electronics, Kitchen, Clothes, Vehicles, or Fragile.
      3. For each item, estimate the quantity.
      4. Flag items as 'isFragile' if they are made of glass, delicate materials, or high-value electronics.
      5. Estimate the volume of each item in cubic meters (m3).
      6. Calculate the total volume for the entire room.
      
      Supported specific item names for price matching (use these if they fit):
      Bed, Sofa, Table, Chair, TV, Fridge, Washing Machine, AC, Microwave, Kitchen Box, Clothes Bag, Suitcase, Glass Item, Mirror, Artwork, Workstation, Office Chair, Server, Document Box, Storage Unit, Bike, Car.

      If an item doesn't fit, use a descriptive name.
      Return the results in the specified JSON format.
    `;

    // Remove the data:image/png;base64, part if present
    const base64Data = fileData.split(",")[1] || fileData;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("AI Scan Error:", error);
    throw new Error("Failed to analyze inventory. Please try again.");
  }
}
