import { StateSchema } from '@/app/providers/StoreProvider';
import { TypingText, TypingTextOptions } from '../types/typingTextSchema';

export const getTypingTextContent = (state: StateSchema): string => state.typingText?.content || '';
export const getTypingTextLoading = (state: StateSchema): boolean => state.typingText?.isLoading || false;
export const getTypingTextError = (state: StateSchema): string | undefined => state.typingText?.error;

export const getCurrentTypingText = (state: StateSchema): TypingText | undefined => {
  const s = state.typingText;
  if (!s?.id || !s?.content || !s?.options) return undefined;
  return {
    id: s.id,
    content: s.content,
    options: s.options,
    // Defaults for fields not tracked in flat shape
    // These can be refined when the slice stores full object
    source: 'generated',
    language: 'en',
  };
};

export const getCurrentTypingTextOptions = (state: StateSchema): TypingTextOptions | undefined => state.typingText?.options;

