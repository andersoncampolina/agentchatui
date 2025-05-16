export interface Message {
  lc: number;
  type: string;
  id: string[];
  kwargs: {
    content: string;
    tool_calls?: any[];
    invalid_tool_calls?: any[];
    additional_kwargs: any;
    response_metadata: any;
  };
}

export interface InputChatProps {
  model?: string;
}
