'use client'

import { OpenAI } from "openai";


export const SwapRating = ()=>{
  return (
    <>
    
    </>
  );
};



// dont foget create OPENAI_API_KEY

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, description, category, condition, images } = req.body;

  // Prepare message parts
  const messages = [
    {
      role: "user",
      content: [
        { type: "text", text: `Estimate a fair price for this item:\nName: ${name}\nDescription: ${description}\nCategory: ${category}\nCondition: ${condition}` },
        // Add each image as a separate content part
        ...(images || []).map(url => ({
          type: "image_url",
          image_url: { url }
        }))
      ]
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // or "gpt-4-vision-preview"
      messages,
      max_tokens: 20,
    });

    const value_estimate = completion.choices[0].message.content.trim();
    res.status(200).json({ value_estimate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



const response = await fetch('/api/estimate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "iPhone 12",
    description: "Brand new, sealed box",
    category: "Electronics",
    condition: "New",
    images: [
      "https://example.com/img1.jpg",
      "https://example.com/img2.jpg"
    ]
  }),
});
const data = await response.json();
console.log(data.value_estimate);