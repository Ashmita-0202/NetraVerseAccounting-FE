import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { I18nextProvider } from "react-i18next";
import i18n from "./components/translate/i18n";
import "./index.css";
import { useEffect } from "react";
const App = () => {
  const lan = localStorage.getItem("language");
  useEffect(() => {
    if (lan) {
      if (lan === "नेपाली") {
        i18n.changeLanguage("ne");
      } else i18n.changeLanguage("en");
    }
  }, [lan, i18n]);

  return (
    <>
      <I18nextProvider i18n={i18n}>
        <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
          <RouterProvider router={router} />
        </div>
      </I18nextProvider>
    </>
  );
};

export default App;
