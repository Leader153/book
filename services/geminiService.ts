
import { GoogleGenAI } from "@google/genai";
import { BookingData } from "../types";
import { EXTRAS_MAP } from "../constants";

export async function generateAIGreeting(data: BookingData): Promise<string> {
  // Fix: Initialize GoogleGenAI with fresh environment variable access per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const selectedExtraNames = data.selectedExtras
      .filter(extra => extra !== 'none')
      .map(extra => EXTRAS_MAP[extra])
      .join(', ');

    const extrasText = selectedExtraNames ? `תוספות שנבחרו: ${selectedExtraNames}.` : 'ללא תוספות מיוחדות.';
    const orderNumberText = data.orderNumber ? `מספר הזמנה: ${data.orderNumber}.` : '';

    // Fix: Use ai.models.generateContent with a direct string prompt and recommended model
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a polite and exciting WhatsApp message in HEBREW for a client who just booked a yacht cruise. 
      Details:
      Name: ${data.clientName}
      Date: ${data.date.split('-').reverse().join('/')}
      Time: ${data.startTime} to ${data.endTime}
      Yacht: ${data.yachtName}
      ${extrasText}
      ${orderNumberText}
      Total Price: ${data.price}
      Paid Downpayment: ${data.downPayment}
      Company: Leader Cruises (לידר הפלגות)
      
      The tone should be professional yet warm and welcoming. Use emojis. Make sure to remind them that the rest of the payment is ${data.price - data.downPayment} NIS.`,
    });

    // Fix: Access .text property directly (do not call as a function)
    return response.text || "Could not generate greeting.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error communicating with AI.";
  }
}
