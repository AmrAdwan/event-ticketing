// import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";

// import React from "react";
// import ReactDOM from "react-dom/client";

// import App from "./App";
// import reportWebVitals from "./reportWebVitals";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Load Google Translate script
// const addGoogleTranslateScript = () => {
//   const script = document.createElement("script");
//   script.type = "text/javascript";
//   script.src =
//     "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//   script.async = true;
//   document.body.appendChild(script);
// };

// const googleTranslateElementInit = () => {
//   new window.google.translate.TranslateElement(
//     { pageLanguage: "en" },
//     "google_translate_element"
//   );
// };

// window.googleTranslateElementInit = googleTranslateElementInit;
// addGoogleTranslateScript();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
