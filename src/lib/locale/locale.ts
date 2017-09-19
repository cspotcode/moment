 import { Object_assign } from "../utils/hooks";

// Side effect imports
import './prototype';

import {
    getSetGlobalLocale,
    defineLocale,
    updateLocale,
    getLocale,
    listLocales
} from './locales';

import {
    listMonths,
    listMonthsShort,
    listWeekdays,
    listWeekdaysShort,
    listWeekdaysMin
} from './lists';

export {
    getSetGlobalLocale,
    defineLocale,
    updateLocale,
    getLocale,
    listLocales,
    listMonths,
    listMonthsShort,
    listWeekdays,
    listWeekdaysShort,
    listWeekdaysMin
};

import { deprecate } from '../utils/deprecate';
import { hooks } from '../utils/hooks';

export const staticAdditions = {
    lang: deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale),
    langData: deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale)
}
Object_assign(hooks, staticAdditions);
export type StaticAdditions = typeof staticAdditions;
declare module '../utils/hooks' {
    interface MomentStatic extends StaticAdditions {}
}

import './en';
