/**
 * AI 聊天相关 API 服务
 */
import apiClient from "./axios";

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  reasoning?: string;
}

/**
 * 发送聊天消息（流式）
 * @param messages 消息列表
 * @returns 可读流
 */
export async function sendChatStream(
  messages: Message[],
): Promise<ReadableStream> {
  const response = await apiClient.post(
    "/ai/chat/stream",
    {
      messages,
    },
    {
      responseType: "stream",
    },
  );

  if (!response.data) {
    throw new Error("无法获取响应流");
  }

  return response.data;
}
