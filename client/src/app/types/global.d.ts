// Shared utility types used across the app

// OptionalRecord<K, T> makes each key in K optional with value type T
type OptionalRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

// DeepPartial<T> makes all properties of T optional recursively
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

