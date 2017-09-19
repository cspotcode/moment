//! moment.js
//! version : 2.18.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

import { hooks as moment, setHookCallback } from './lib/utils/hooks';
import { LocaleSpecification } from "./lib/locale/locales";

declare global {
    type TODO = any;
    type Dictionary<T> = {[prop: string]: T};
}

declare module './lib/utils/hooks' {
    interface MomentStatic {
        version: string;
    }
}
moment.version = '2.18.1';

import {
    min,
    max,
    now,
    isMoment,
    momentPrototype as fn,
    createUTC       as utc,
    createUnix      as unix,
    createLocal     as local,
    createInvalid   as invalid,
    createInZone    as parseZone
} from './lib/moment/moment';

import {
    getCalendarFormat
} from './lib/moment/calendar';

import {
    defineLocale,
    updateLocale,
    getSetGlobalLocale as locale,
    getLocale          as localeData,
    listLocales        as locales,
    listMonths         as months,
    listMonthsShort    as monthsShort,
    listWeekdays       as weekdays,
    listWeekdaysMin    as weekdaysMin,
    listWeekdaysShort  as weekdaysShort
} from './lib/locale/locale';

import {
    isDuration,
    createDuration              as duration,
    getSetRelativeTimeRounding  as relativeTimeRounding,
    getSetRelativeTimeThreshold as relativeTimeThreshold
} from './lib/duration/duration';

import { normalizeUnits } from './lib/units/units';

import isDate from './lib/utils/is-date';
import { Object_assign } from "./lib/utils/hooks";

export type Local = typeof local;
declare module './lib/utils/hooks' {
    interface MomentStatic extends Local {}
}
setHookCallback(local);

export const staticAdditions = {
    fn,
    min,
    max,
    now,
    utc,
    unix,
    months,
    isDate,
    locale,
    invalid,
    duration,
    isMoment,
    weekdays,
    parseZone,
    localeData,
    isDuration,
    monthsShort,
    weekdaysMin,
    defineLocale,
    updateLocale,
    locales,
    weekdaysShort,
    normalizeUnits,
    relativeTimeRounding,
    relativeTimeThreshold,
    calendarFormat: getCalendarFormat,
    prototype: fn
}
Object_assign(moment, staticAdditions);

export type StaticAdditions = typeof staticAdditions;
declare module './lib/utils/hooks' {
    interface MomentStatic extends StaticAdditions {}
}

export default moment;