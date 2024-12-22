import { configureStore } from '@reduxjs/toolkit';
import calculatorReducer from '../features/calculator/calculatorSlice'

export default store = configureStore({
  reducer: {
    calculator: calculatorReducer,
  },
});
