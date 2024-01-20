import en from './en'
import ja from './ja'
import ru from './ru'

import {
    createI18n
} from "vue-i18n";

const languageConverter = (isoLocale) => isoLocale.split('-')[0]

var locale = localStorage.getItem('locale');

if (locale == null || locale == undefined) {
    locale = languageConverter(window.navigator.language);
    localStorage.setItem('locale', locale);
}



export default createI18n({
    locale: locale,
    fallbackLocale: 'ru',
    legacy: false, // <--- 3
    globalInjection: true,
    messages: {
        en,
        ja,
        ru
    },
})