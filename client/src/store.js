import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import profileReducer from './features/profileSlice';
import jobReducer from './features/jobSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux'
import thunk from 'redux-thunk';


const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    user: userReducer,
    profile: profileReducer,
    job: jobReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk]
})

export const persistor = persistStore(store)