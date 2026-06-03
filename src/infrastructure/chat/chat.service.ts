import { Injectable } from "@nestjs/common";
import { GeminiService } from "./gemini/gemini.service";
import { ToolExecutorService } from "./tools/tool-executor.service";
import { ToolRegistryService } from "./tools/tool-registry.service";
import { SYSTEM_INSTRUCTION } from "./proms/system-instruction.prom";

@Injectable()
export class ChatService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly toolRegistry: ToolRegistryService,
    private readonly toolExecutor: ToolExecutorService,
  ) {}

  async chat(message: string, user?: any) {
    const firstResponse = await this.geminiService.ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],

      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [
          {
            functionDeclarations: this.toolRegistry.getTools(),
          },
        ],
      },
    });

    const functionCalls = firstResponse.functionCalls ?? [];

    if (functionCalls.length === 0) {
      return {
        answer: firstResponse.text,
      };
    }

    const functionResponses = [];

    for (const call of functionCalls) {
      const result = await this.toolExecutor.execute(call.name, call.args, user);

      functionResponses.push({
        name: call.name,
        response: {
          result,
        },
      });
    }

    const finalResponse = await this.geminiService.ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },

        {
          role: "model",
          parts: functionCalls.map((call) => ({
            functionCall: {
              name: call.name,
              args: call.args,
            },
          })),
        },

        {
          role: "user",
          parts: functionResponses.map((response) => ({
            functionResponse: response,
          })),
        },
      ],

      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return {
      answer: finalResponse.text,
    };
  }
}
