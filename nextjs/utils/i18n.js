import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/public/locales/en/common.json";
import idn from "@/public/locales/idn/common.json";
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
    idn: {
        translation: idn
    }
};

i18n.use(initReactI18next).init({
    fallbackLng: "en",
    lng: "en",
    defaultLocale: "en",
    locales: ["en", "ind", "vn", "th", "idn"],
    interpolation: {
        escapeValue: false
    },
    resources: resource,
    debug: false
});

export default i18n;
