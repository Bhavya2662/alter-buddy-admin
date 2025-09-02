import React, { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppRouters } from "./pages";

function App() {
     return (
          <Fragment>
               <ToastContainer autoClose={1000} />
               <AppRouters />
          </Fragment>
     );
}

export default App;
