import {
    UnknownAction, combineReducers, Reducer, ReducersMapObject,
} from '@reduxjs/toolkit';
import {
    MountedReducers, ReducerManager, StateSchema, StateSchemaKey,
} from './StateSchema';

export function createReducerManager(initialReducers: ReducersMapObject<StateSchema>): ReducerManager {
    const reducers: ReducersMapObject<StateSchema> = { ...initialReducers } as ReducersMapObject<StateSchema>;

    let combinedReducer: Reducer<StateSchema> = combineReducers(reducers as any) as unknown as Reducer<StateSchema>;

    let keysToRemove: Array<StateSchemaKey> = [];
    const mountedReducers: MountedReducers = {};

    return {
        getReducerMap: () => reducers,
        getMountedReducers: () => mountedReducers,
        reduce: (state: StateSchema, action: UnknownAction) => {
            if (keysToRemove.length > 0) {
                state = { ...state };
                keysToRemove.forEach((key) => {
                    delete state[key];
                });
                keysToRemove = [];
            }
            return combinedReducer(state, action);
        },
        add: (key: StateSchemaKey, reducer: Reducer) => {
            if (!key || reducers[key]) {
                return;
            }
            // Assign reducer for the dynamic key
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (reducers as any)[key] = reducer;
            mountedReducers[key] = true;

            combinedReducer = combineReducers(reducers as any) as unknown as Reducer<StateSchema>;
        },
        remove: (key: StateSchemaKey) => {
            if (!key || !reducers[key]) {
                return;
            }
            // delete dynamic reducer and mark for removal
            delete (reducers as Partial<ReducersMapObject<StateSchema>>)[key];
            keysToRemove.push(key);
            mountedReducers[key] = false;

            combinedReducer = combineReducers(reducers as any) as unknown as Reducer<StateSchema>;
        },
    };
}
