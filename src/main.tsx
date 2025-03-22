import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

const root = document.getElementById("root");

if (root) {
    ReactDOM.createRoot(root).render(
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </I18nextProvider>
    );
}