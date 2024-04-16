import * as i18next from 'i18next';
import detector from "i18next-browser-languagedetector";

import translationEN from '../resources/locales/en.json';
import translationFR from '../resources/locales/fr.json';
import {Device} from '@capacitor/device';

export class i18n {
    load = () => {
        return new Promise((resolve, reject) => {
            Device.getLanguageCode()
                .then(lng => {
                    i18next.use(detector)
                        .init({
                            interpolation: {escapeValue: false},
                            fallbackLng: 'en',
                            lng: lng.value,
                            resources: {
                                en: {
                                    translation: translationEN,
                                },
                                fr: {
                                    translation: translationFR,
                                },
                            },
                        }).then(value => resolve(value))
                        .catch(error => reject(error));
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}