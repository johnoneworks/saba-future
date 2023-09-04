import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/public/locales/en/common.json";
import vn from "@/public/locales/vn/common.json";

console.log(en);
const resource = {
    en: {
        translation: en
    },
    vn: {
        translation: vn
    }
};

i18n.use(initReactI18next).init({
    fallbackLng: "en",
    lng: "en",
    defaultLocale: "en",
    locales: ["en", "vn"],
    interpolation: {
        escapeValue: false
    },
    resource,
    debug: true
});

export default i18n;
