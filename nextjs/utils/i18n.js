import { LANGUAGES, SESSION_STORAGE } from "@/constants/Constant";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/public/locales/en/common.json";
import id from "@/public/locales/id/common.json";
import ind from "@/public/locales/ind/common.json";
import th from "@/public/locales/th/common.json";
import vn from "@/public/locales/vn/common.json";

const resource = {
    en: {
        translation: en
    },
    ind: {
        translation: ind
    },
    vn: {
        translation: vn
    },
    th: {
        translation: th
    },
    id: {
        translation: id
    }
};

let defaultLanguage = LANGUAGES.EN;
if (typeof window !== "undefined") {
    if (sessionStorage.getItem(SESSION_STORAGE.DEFAULT_LANGUAGE)) {
        defaultLanguage = sessionStorage.getItem(SESSION_STORAGE.DEFAULT_LANGUAGE);
    } else {
        sessionStorage.setItem(SESSION_STORAGE.DEFAULT_LANGUAGE, LANGUAGES.EN);
    }
}

i18n.use(initReactI18next).init({
    fallbackLng: defaultLanguage,
    lng: defaultLanguage,
    defaultLocale: defaultLanguage,
    locales: [LANGUAGES.EN, LANGUAGES.ID, LANGUAGES.IN, LANGUAGES.TH, LANGUAGES.VN],
    interpolation: {
        escapeValue: false
    },
    resources: resource,
    debug: false
});

export default i18n;
