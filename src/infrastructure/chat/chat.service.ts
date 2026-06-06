import { Injectable } from "@nestjs/common";
import { OpenAIService } from "./openai/openai.service";
import { ToolExecutorService } from "./tools/tool-executor.service";
import { ToolRegistryService } from "./tools/tool-registry.service";
import { SYSTEM_INSTRUCTION } from "./proms/system-instruction.prom";

@Injectable()
export class ChatService {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly toolRegistry: ToolRegistryService,
    private readonly toolExecutor: ToolExecutorService,
  ) {}
  private readonly MODEL = process.env.OPENAI_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct";

  async chat(message: string, user?: any) {
    const messages: any[] = [
      { role: "system", content: SYSTEM_INSTRUCTION },
      { role: "user", content: message },
    ];

    const tools = this.toolRegistry.getTools().map((tool) => this.convertGeminiToolToOpenAI(tool));
    const maxIterations = 5;
    let currentIteration = 0;

    while (currentIteration < maxIterations) {
      currentIteration++;

      const response = await this.openaiService.openai.chat.completions.create({
        model: this.MODEL,
        messages,
        tools,
      });

      const assistantMessage = response.choices[0].message;
      messages.push(assistantMessage);

      const toolCalls = assistantMessage.tool_calls ?? [];
      if (toolCalls.length === 0) {
        return {
          answer: assistantMessage.content ?? "",
        };
      }

      for (const toolCall of toolCalls) {
        const functionName = (toolCall as any).function.name;
        const functionArgs = JSON.parse((toolCall as any).function.arguments);

        const result = await this.toolExecutor.execute(functionName, functionArgs, user);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: JSON.stringify(result),
        });
      }
    }

    return {
      answer: messages[messages.length - 1]?.content ?? "Không thể hoàn thành yêu cầu.",
    };
  }

  async *chatStream(message: string, user?: any): AsyncGenerator<{ event: string; data: any }> {
    const messages: any[] = [
      { role: "system", content: SYSTEM_INSTRUCTION },
      { role: "user", content: message },
    ];

    const tools = this.toolRegistry.getTools().map((tool) => this.convertGeminiToolToOpenAI(tool));
    const maxIterations = 5;
    let currentIteration = 0;
    let shouldContinue = true;

    while (currentIteration < maxIterations && shouldContinue) {
      currentIteration++;

      const responseStream = await this.openaiService.openai.chat.completions.create({
        model: this.MODEL,
        messages,
        tools,
        stream: true,
      });

      let assistantContent = "";
      const toolCallsMap = new Map<number, { id: string; name: string; arguments: string }>();

      for await (const chunk of responseStream) {
        const choice = chunk.choices[0];
        if (!choice) continue;

        const delta = choice.delta;
        if (delta.content) {
          assistantContent += delta.content;
          yield { event: "content", data: delta.content };
        }

        if (delta.tool_calls) {
          for (const tc of delta.tool_calls) {
            const index = tc.index;
            if (!toolCallsMap.has(index)) {
              toolCallsMap.set(index, {
                id: tc.id || "",
                name: tc.function?.name || "",
                arguments: "",
              });
            }
            const current = toolCallsMap.get(index)!;
            if (tc.id) current.id = tc.id;
            if (tc.function?.name) current.name = tc.function.name;
            if (tc.function?.arguments) current.arguments += tc.function.arguments;
          }
        }
      }

      const toolCalls = Array.from(toolCallsMap.values());

      const assistantMessage = {
        role: "assistant",
        content: assistantContent || null,
        tool_calls:
          toolCalls.length > 0
            ? toolCalls.map((tc) => ({
                id: tc.id,
                type: "function" as const,
                function: {
                  name: tc.name,
                  arguments: tc.arguments,
                },
              }))
            : undefined,
      };

      messages.push(assistantMessage);

      if (toolCalls.length > 0) {
        const executedTools: any[] = [];

        for (const toolCall of toolCalls) {
          const functionName = toolCall.name;
          const functionArgs = JSON.parse(toolCall.arguments);

          yield { event: "tool_start", data: { name: functionName, args: functionArgs } };

          const result = await this.toolExecutor.execute(functionName, functionArgs, user);

          executedTools.push({
            toolName: functionName,
            result,
          });

          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: functionName,
            content: JSON.stringify(result),
          });
        }

        yield { event: "tool_results", data: executedTools };
      } else {
        shouldContinue = false;
      }
    }
  }

  private convertSchema(geminiSchema: any): any {
    if (!geminiSchema) return undefined;

    const openAISchema: any = { ...geminiSchema };

    if (typeof openAISchema.type === "string") {
      openAISchema.type = openAISchema.type.toLowerCase();
    }

    if (openAISchema.nullable) {
      if (typeof openAISchema.type === "string") {
        openAISchema.type = [openAISchema.type, "null"];
      } else if (Array.isArray(openAISchema.type) && !openAISchema.type.includes("null")) {
        openAISchema.type.push("null");
      }
      delete openAISchema.nullable;
    }

    if (openAISchema.properties) {
      const requiredFields = openAISchema.required || [];
      const newProps = {};
      for (const key of Object.keys(openAISchema.properties)) {
        const propSchema = this.convertSchema(openAISchema.properties[key]);
        if (!requiredFields.includes(key) && propSchema && propSchema.type) {
          if (typeof propSchema.type === "string") {
            propSchema.type = [propSchema.type, "null"];
          } else if (Array.isArray(propSchema.type) && !propSchema.type.includes("null")) {
            propSchema.type.push("null");
          }
        }
        newProps[key] = propSchema;
      }
      openAISchema.properties = newProps;
    }

    if (openAISchema.items) {
      openAISchema.items = this.convertSchema(openAISchema.items);
    }

    return openAISchema;
  }

  private convertGeminiToolToOpenAI(geminiTool: any): any {
    return {
      type: "function",
      function: {
        name: geminiTool.name,
        description: geminiTool.description,
        parameters: this.convertSchema(geminiTool.parameters),
      },
    };
  }
}
