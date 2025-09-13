export type { TypingTextOptions, TypingText, TypingTextSchema } from './model/types/typingTextSchema';
export { typingTextReducer, typingTextActions } from './model/slice/typingTextSlice';
export { fetchText } from './model/services/fetchText/fetchText';
export {
  getTypingTextContent,
  getTypingTextLoading,
  getTypingTextError,
  getCurrentTypingText,
  getCurrentTypingTextOptions,
} from './model/selectors/getTypingText';

