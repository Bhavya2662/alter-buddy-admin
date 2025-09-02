import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppProvider } from "./provider";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
     <AppProvider>
          <React.StrictMode>
               <App />
          </React.StrictMode>
     </AppProvider>
);
