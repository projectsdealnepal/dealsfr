import { configureStore } from "@reduxjs/toolkit";
import bannerReducer from "@/redux/features/banner/bannerSlice";
import discountReducer from "@/redux/features/discount/discountSlice";
import layoutReducer from "@/redux/features/layout/layoutSlice";
import userReducer from "@/redux/features/user/userSlice";
import categoryReducer from "@/redux/features/category/categorySlice";
import productReducer from '@/redux/features/product/productSlice'
import orderReducer from '@/redux/features/order/orderSlice'
import storeReducer from '@/redux/features/store/storeSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      userData: userReducer,
      banner: bannerReducer,
      discount: discountReducer,
      layout: layoutReducer,
      category: categoryReducer,
      product: productReducer,
      store: storeReducer,
      order: orderReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
