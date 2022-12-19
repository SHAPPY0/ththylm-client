import { createStore } from 'redux';
import reducer from './config/reducers';

const store = createStore(reducer);

export default store;