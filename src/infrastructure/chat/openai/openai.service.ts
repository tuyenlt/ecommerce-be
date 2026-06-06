import { Injectable } from "@nestjs/common";
import { OpenAI } from "openai";

@Injectable()
export class OpenAIService {
  readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "dummy-key",
      baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    });
  }
}
