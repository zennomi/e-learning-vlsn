import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
// import mailReducer from './slices/mail';
// import chatReducer from './slices/chat';
// import productReducer from './slices/product';
// import calendarReducer from './slices/calendar';
// import kanbanReducer from './slices/kanban';
import createTestReducer from './slices/createTest';

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

const rootReducer = combineReducers({
  // mail: mailReducer,
  // chat: chatReducer,
  // calendar: calendarReducer,
  // kanban: kanbanReducer,
  createTest: persistReducer(createTestPersistConfig, createTestReducer),
});

export { rootPersistConfig, rootReducer };
