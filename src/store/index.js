import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from 'redux-persist'

import userSlice from './informationSlice'


const appReducer = combineReducers({
    author: userSlice,
})

const rootReducer = (state, action) => {
    if (action.type === 'RESET_APP') {
        return appReducer(undefined, action)
    }
    return appReducer(state, action)
}

const persistConfig = {
    key: 'zz',
    storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)

export default configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
})
