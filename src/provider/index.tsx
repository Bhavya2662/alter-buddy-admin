import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../app/store";

export const AppProvider = ({ children }: { children: ReactNode }) => {
     return (
          <Provider store={store}>
               <BrowserRouter>{children}</BrowserRouter>
          </Provider>
     );
};
