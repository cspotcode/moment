import isArray from '../utils/is-array';
import hasOwnProp from '../utils/has-own-prop';
import isUndefined from '../utils/is-undefined';
import compareArrays from '../utils/compare-arrays';
import { deprecateSimple } from '../utils/deprecate';
import { mergeConfigs } from './set';
import { Locale } from './constructor';
import keys from '../utils/keys';

import { baseConfig } from './base-config';
import { Moment } from "../utils/hooks";

// internal storage for locale config files
var locales = {};
var localeFamilies = {};
var globalLocale;

function normalizeLocale(key) {
    return key ? key.toLowerCase().replace('_', '-') : key;
}

// pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
function chooseLocale(names) {
    var i = 0, j, next, locale, split;

    while (i < names.length) {
        split = normalizeLocale(names[i]).split('-');
        j = split.length;
        next = normalizeLocale(names[i + 1]);
        next = next ? next.split('-') : null;
        while (j > 0) {
            locale = loadLocale(split.slice(0, j).join('-'));
            if (locale) {
                return locale;
            }
            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                //the next array item is better than a shallower substring of this one
                break;
            }
            j--;
        }
        i++;
    }
    return null;
}

declare global {
    const module: {
        exports: any;
    };
    function require(path: string): any;
}

function loadLocale(name) {
    var oldLocale = null;
    // TODO: Find a better way to register and load all the locales in Node
    if (!locales[name] && (typeof module !== 'undefined') &&
            module && module.exports) {
        oldLocale = globalLocale._abbr;
        try {
            require('moment/locale/' + name);
        } catch (e) {
            // In the test environment, the external module 'moment'
            // can't be resolved because we're running inside it.
            // Fallback to using the old relative import
            try {
                require('./locale/' + name);
            } catch (e) { }
        }

        // because defineLocale currently also sets the global locale, we
        // want to undo that for lazy loaded locales
        getSetGlobalLocale(oldLocale);
    }
    return locales[name];
}

export type RelativeTimeKey = 's' | 'm' | 'mm' | 'h' | 'hh' | 'd' | 'dd' | 'M' | 'MM' | 'y' | 'yy';
export type MonthWeekdayFn = (momentToFormat: Moment, format?: string) => string;
export type WeekdaySimpleFn = (momentToFormat: Moment) => string;
export interface StandaloneFormatSpec {
    format: string[];
    standalone: string[];
    isFormat?: RegExp;
}
export interface LongDateFormatSpec {
    LTS: string;
    LT: string;
    L: string;
    LL: string;
    LLL: string;
    LLLL: string;

    // lets forget for a sec that any upper/lower permutation will also work
    lts?: string;
    lt?: string;
    l?: string;
    ll?: string;
    lll?: string;
    llll?: string;
}
export type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
export interface MomentInputObject {
    years?: number;
    year?: number;
    y?: number;

    months?: number;
    month?: number;
    M?: number;

    days?: number;
    day?: number;
    d?: number;

    dates?: number;
    date?: number;
    D?: number;

    hours?: number;
    hour?: number;
    h?: number;

    minutes?: number;
    minute?: number;
    m?: number;

    seconds?: number;
    second?: number;
    s?: number;

    milliseconds?: number;
    millisecond?: number;
    ms?: number;
}
export type CalendarSpecVal = string | ((m?: MomentInput, now?: Moment) => string);
export interface CalendarSpec {
    sameDay?: CalendarSpecVal;
    nextDay?: CalendarSpecVal;
    lastDay?: CalendarSpecVal;
    nextWeek?: CalendarSpecVal;
    lastWeek?: CalendarSpecVal;
    sameElse?: CalendarSpecVal;

    // any additional properties might be used with moment.calendarFormat
    [x: string]: CalendarSpecVal | void; // undefined
}
export type RelativeTimeSpecVal = (
    string |
    ((n: number, withoutSuffix: boolean,
      key: RelativeTimeKey, isFuture: boolean) => string)
);
export type RelativeTimeFuturePastVal = string | ((relTime: string) => string);
export interface RelativeTimeSpec {
    future: RelativeTimeFuturePastVal;
    past: RelativeTimeFuturePastVal;
    s: RelativeTimeSpecVal;
    m: RelativeTimeSpecVal;
    mm: RelativeTimeSpecVal;
    h: RelativeTimeSpecVal;
    hh: RelativeTimeSpecVal;
    d: RelativeTimeSpecVal;
    dd: RelativeTimeSpecVal;
    M: RelativeTimeSpecVal;
    MM: RelativeTimeSpecVal;
    y: RelativeTimeSpecVal;
    yy: RelativeTimeSpecVal;
}
export interface WeekSpec {
    dow: number;
    doy: number;
}
export interface LocaleSpecification {
    months?: string[] | StandaloneFormatSpec | MonthWeekdayFn;
    monthsShort?: string[] | StandaloneFormatSpec | MonthWeekdayFn;

    weekdays?: string[] | StandaloneFormatSpec | MonthWeekdayFn;
    weekdaysShort?: string[] | StandaloneFormatSpec | WeekdaySimpleFn;
    weekdaysMin?: string[] | StandaloneFormatSpec | WeekdaySimpleFn;

    meridiemParse?: RegExp;
    meridiem?: (hour: number, minute:number, isLower: boolean) => string;

    isPM?: (input: string) => boolean;

    longDateFormat?: LongDateFormatSpec;
    calendar?: CalendarSpec;
    relativeTime?: RelativeTimeSpec;
    invalidDate?: string;
    ordinal?: (n: number) => string;
    ordinalParse?: RegExp;

    week?: WeekSpec;

    // Allow anything: in general any property that is passed as locale spec is
    // put in the locale object so it can be used by locale functions
    [x: string]: any;
}

// This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.
export function getSetGlobalLocale (key?, values?: LocaleSpecification | void) {
    var data;
    if (key) {
        if (isUndefined(values)) {
            data = getLocale(key);
        }
        else {
            data = defineLocale(key, values);
        }

        if (data) {
            // moment.duration._locale = moment._locale = data;
            globalLocale = data;
        }
    }

    return globalLocale._abbr;
}

export function defineLocale (name, config) {
    if (config !== null) {
        var parentConfig = baseConfig;
        config.abbr = name;
        if (locales[name] != null) {
            deprecateSimple('defineLocaleOverride',
                    'use moment.updateLocale(localeName, config) to change ' +
                    'an existing locale. moment.defineLocale(localeName, ' +
                    'config) should only be used for creating a new locale ' +
                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
            parentConfig = locales[name]._config;
        } else if (config.parentLocale != null) {
            if (locales[config.parentLocale] != null) {
                parentConfig = locales[config.parentLocale]._config;
            } else {
                if (!localeFamilies[config.parentLocale]) {
                    localeFamilies[config.parentLocale] = [];
                }
                localeFamilies[config.parentLocale].push({
                    name: name,
                    config: config
                });
                return null;
            }
        }
        locales[name] = new Locale(mergeConfigs(parentConfig, config));

        if (localeFamilies[name]) {
            localeFamilies[name].forEach(function (x) {
                defineLocale(x.name, x.config);
            });
        }

        // backwards compat for now: also set the locale
        // make sure we set the locale AFTER all child locales have been
        // created, so we won't end up with the child locale set.
        getSetGlobalLocale(name);


        return locales[name];
    } else {
        // useful for testing
        delete locales[name];
        return null;
    }
}

export function updateLocale(name, config) {
    if (config != null) {
        var locale, parentConfig = baseConfig;
        // MERGE
        if (locales[name] != null) {
            parentConfig = locales[name]._config;
        }
        config = mergeConfigs(parentConfig, config);
        locale = new Locale(config);
        locale.parentLocale = locales[name];
        locales[name] = locale;

        // backwards compat for now: also set the locale
        getSetGlobalLocale(name);
    } else {
        // pass null for config to unupdate, useful for tests
        if (locales[name] != null) {
            if (locales[name].parentLocale != null) {
                locales[name] = locales[name].parentLocale;
            } else if (locales[name] != null) {
                delete locales[name];
            }
        }
    }
    return locales[name];
}

// returns locale data
export function getLocale (key?) {
    var locale;

    if (key && key._locale && key._locale._abbr) {
        key = key._locale._abbr;
    }

    if (!key) {
        return globalLocale;
    }

    if (!isArray(key)) {
        //short-circuit everything else
        locale = loadLocale(key);
        if (locale) {
            return locale;
        }
        key = [key];
    }

    return chooseLocale(key);
}

export function listLocales() {
    return keys(locales);
}
