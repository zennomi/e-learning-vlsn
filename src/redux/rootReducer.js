import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
// import productReducer from './slices/product';
import createTestReducer from './slices/createTest';
import orderReducer from './slices/order';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const createTestPersistConfig = {
  key: 'createTest',
  storage,
  keyPrefix: 'redux-',
};

const orderPersistConfig = {
  key: 'order',
  storage,
  keyPrefix: 'redux-',
}

const rootReducer = combineReducers({
  createTest: persistReducer(createTestPersistConfig, createTestReducer),
  order: persistReducer(orderPersistConfig, orderReducer),
});

export { rootPersistConfig, rootReducer };
