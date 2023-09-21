import { LANGUAGES } from "./constants/Constant";

module.export = {
    i18n: {
        defaultLocale: LANGUAGES.EN,
        locales: [LANGUAGES.EN, LANGUAGES.VN, LANGUAGES.IN, LANGUAGES.TH, LANGUAGES.ID],
        localePath: require("path").resolve("./public/locales")
    }
};
