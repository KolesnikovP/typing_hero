import { StateSchema } from '@/app/providers/StoreProvider';

export const getTypingTextContent = (state: StateSchema) => state.typingText?.content || '';
export const getTypingTextLoading = (state: StateSchema) => state.typingText?.isLoading || false;
export const getTypingTextError = (state: StateSchema) => state.typingText?.error;

