import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import {Provider} from "react-redux";
import store from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer
      toastClassName={({ type }) => {
        const base =
          "relative flex items-start gap-3 px-4 py-3.5 rounded-xl border text-sm font-medium tracking-tight shadow-sm mb-2 cursor-pointer overflow-hidden transition-all duration-300";
        const types = {
          success: "bg-white border-black/8 text-black",
          error: "bg-white border-black/8 text-black",
          warning: "bg-white border-black/8 text-black",
          info: "bg-white border-black/8 text-black",
          default: "bg-white border-black/8 text-black",
        };
        return `${base} ${types[type] || types.default}`;
      }}
      bodyClassName={() =>
        "flex items-center gap-2 text-sm text-black/70 tracking-tight"
      }
      progressClassName={({ type }) => {
        const types = {
          success: "bg-green-400",
          error: "bg-red-400",
          warning: "bg-yellow-400",
          info: "bg-blue-400",
          default: "bg-black/20",
        };
        return types[type] || types.default;
      }}
    />
  </StrictMode>,
);
