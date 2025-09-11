export interface TypingTextOptions {
  length: number;
  punctuation: boolean;
  numbers: boolean;
}

export interface TypingTextSchema {
  id?: string;
  content: string;
  options?: TypingTextOptions;
  isLoading: boolean;
  error?: string;
}

