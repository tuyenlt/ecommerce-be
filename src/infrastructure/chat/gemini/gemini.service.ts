import { Injectable } from "@nestjs/common";
import { GoogleGenAI } from "@google/genai";

@Injectable()
export class GeminiService {
  readonly ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}
