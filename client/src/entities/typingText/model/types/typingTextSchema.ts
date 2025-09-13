export interface TypingTextOptions {
  length: number;
  punctuation: boolean;
  numbers: boolean;
}

export interface TypingText {
  id: string;
  content: string;
  options: TypingTextOptions;
  source: string;
  language: string;
}

export interface TypingTextSchema {
  // Current text fields (kept flat for backward compatibility)
  id?: string;
  content: string;
  options?: TypingTextOptions;
  isLoading: boolean;
  error?: string;

  // Optional cache for future switching by id
  byId?: Record<string, TypingText>;
}

