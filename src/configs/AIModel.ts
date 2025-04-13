import { ChatAnthropic } from "@anthropic-ai/sdk";

interface AIConfig {
  apiKey: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

class AIModel {
  private client: ChatAnthropic;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = {
      maxTokens: 1024,
      temperature: 0.7,
      model: "claude-3-opus-20240229",
      ...config
    };
    this.client = new ChatAnthropic({
      apiKey: this.config.apiKey
    });
  }

  async sendMessage(message: string) {
    return await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      messages: [{ role: "user", content: message }]
    });
  }
}

export const chatSession = new AIModel({
  apiKey: process.env.ANTHROPIC_API_KEY as string
});

export const genAICode = new AIModel({
  apiKey: process.env.ANTHROPIC_API_KEY as string,
  maxTokens: 4096,
  temperature: 0.5
});