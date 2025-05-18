export interface Message {
  lc: number;
  type: string;
  id: string[];
  kwargs: {
    content: string;
    tool_calls?: Record<string, unknown>[];
    invalid_tool_calls?: Record<string, unknown>[];
    additional_kwargs: Record<string, unknown>;
    response_metadata: {
      image_url?: string;
      [key: string]: unknown;
    };
  };
}

export interface InputChatProps {
  model?: string;
}
