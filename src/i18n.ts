import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

import ns1 from "@/locales/en/ns1.json";
import ns2 from "@/locales/es/ns2.json";

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: true,
        interpolation: { escapeValue: false },
        defaultNS: "ns1",
        resources: {
            en: { ns1 },
            es: { ns1: ns2 },
        },
    });

export default i18n;
