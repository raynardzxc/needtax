import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


import ReduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import reducer from './reducers';
 
const persistConfig = {
  key: 'root',
  storage,
}
 
const persistedReducer = persistReducer(persistConfig, reducer)

export const store = createStore(persistedReducer, applyMiddleware(ReduxThunk, logger));
export const persistor = persistStore(store);