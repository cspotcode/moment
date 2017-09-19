import { Object_assign } from "../utils/hooks";
import { Moment } from './constructor';

var proto = Moment.prototype;

import { add, subtract } from './add-subtract';
import { calendar, getCalendarFormat } from './calendar';
import { clone } from './clone';
import { isBefore, isBetween, isSame, isAfter, isSameOrAfter, isSameOrBefore } from './compare';
import { diff } from './diff';
import { format, toString, toISOString, inspect } from './format';
import { from, fromNow } from './from';
import { to, toNow } from './to';
import { stringGet, stringSet } from './get-set';
import { locale, localeData, lang } from './locale';
import { prototypeMin, prototypeMax } from './min-max';
import { startOf, endOf } from './start-end-of';
import { valueOf, toDate, toArray, toObject, toJSON, unix } from './to-type';
import { isValid, parsingFlags, invalidAt } from './valid';
import { creationData } from './creation-data';

const protoAdditions1 = {
    add,
    calendar,
    clone,
    diff,
    endOf,
    format,
    from,
    fromNow,
    to,
    toNow,
    get: stringGet,
    invalidAt,
    isAfter,
    isBefore,
    isBetween,
    isSame,
    isSameOrAfter,
    isSameOrBefore,
    isValid,
    lang,
    locale,
    localeData,
    max: prototypeMax,
    min: prototypeMin,
    parsingFlags,
    set: stringSet,
    startOf,
    subtract,
    toArray,
    toObject,
    toDate,
    toISOString,
    inspect,
    toJSON,
    toString,
    unix,
    valueOf,
    creationData
};

// Year
import { getSetYear, getIsLeapYear } from '../units/year';
const protoAdditions2 = {
    year: getSetYear,
    isLeapYear: getIsLeapYear
};

// Week Year
import { getSetWeekYear, getSetISOWeekYear, getWeeksInYear, getISOWeeksInYear } from '../units/week-year';
const protoAdditions3 = {
    weekYear: getSetWeekYear,
    isoWeekYear: getSetISOWeekYear
};

// Quarter
import { getSetQuarter } from '../units/quarter';
const protoAdditions4 = {
    quarter: getSetQuarter,
    quarters: getSetQuarter
};

// Month
import { getSetMonth, getDaysInMonth } from '../units/month';
const protoAdditions5 = {
    month: getSetMonth,
    daysInMonth: getDaysInMonth
};

// Week
import { getSetWeek, getSetISOWeek } from '../units/week';
const protoAdditions6 = {
    week: getSetWeek,
    weeks: getSetWeek,
    isoWeek: getSetISOWeek,
    isoWeeks: getSetISOWeek,
    weeksInYear: getWeeksInYear,
    isoWeeksInYear: getISOWeeksInYear
};

// Day
import { getSetDayOfMonth } from '../units/day-of-month';
import { getSetDayOfWeek, getSetISODayOfWeek, getSetLocaleDayOfWeek } from '../units/day-of-week';
import { getSetDayOfYear } from '../units/day-of-year';
const protoAdditions7 = {
    date: getSetDayOfMonth,
    day: getSetDayOfWeek,
    days: getSetDayOfWeek,
    weekday: getSetLocaleDayOfWeek,
    isoWeekday: getSetISODayOfWeek,
    dayOfYear: getSetDayOfYear
};

// Hour
import { getSetHour } from '../units/hour';
const protoAdditions8 = {
    hour: getSetHour,
    hours: getSetHour
};

// Minute
import { getSetMinute } from '../units/minute';
const protoAdditions9 = {
    minute: getSetMinute,
    minutes: getSetMinute
};

// Second
import { getSetSecond } from '../units/second';
const protoAdditions10 = {
    second: getSetSecond,
    seconds: getSetSecond
};

// Millisecond
import { getSetMillisecond } from '../units/millisecond';
const protoAdditions11 = {
    millisecond: getSetMillisecond,
    milliseconds: getSetMillisecond
};

// Offset
import {
    getSetOffset,
    setOffsetToUTC,
    setOffsetToLocal,
    setOffsetToParsedOffset,
    hasAlignedHourOffset,
    isDaylightSavingTime,
    isDaylightSavingTimeShifted,
    getSetZone,
    isLocal,
    isUtcOffset,
    isUtc
} from '../units/offset';
const protoAdditions12 = {
    utcOffset: getSetOffset,
    utc: setOffsetToUTC,
    local: setOffsetToLocal,
    parseZone: setOffsetToParsedOffset,
    hasAlignedHourOffset,
    isDST: isDaylightSavingTime,
    isLocal,
    isUtcOffset,
    isUtc,
    isUTC: isUtc
};

// Timezone
import { getZoneAbbr, getZoneName } from '../units/timezone';
const protoAdditions13 = {
    zoneAbbr: getZoneAbbr,
    zoneName: getZoneName
};

// Deprecations
import { deprecate } from '../utils/deprecate';
const protoAdditions14 = {
    dates: deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth),
    months: deprecate('months accessor is deprecated. Use month instead', getSetMonth),
    years: deprecate('years accessor is deprecated. Use year instead', getSetYear),
    zone: deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone),
    isDSTShifted: deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted)
};

export const protoAdditions = {
    ...protoAdditions1,
    ...protoAdditions2,
    ...protoAdditions3,
    ...protoAdditions4,
    ...protoAdditions5,
    ...protoAdditions6,
    ...protoAdditions7,
    ...protoAdditions8,
    ...protoAdditions9,
    ...protoAdditions10,
    ...protoAdditions11,
    ...protoAdditions12,
    ...protoAdditions13,
    ...protoAdditions14
}
Object_assign(proto, protoAdditions);
export type ProtoAdditions = typeof protoAdditions;
declare module '../utils/hooks' {
    namespace hooks {
        interface Moment extends ProtoAdditions {}
    }
}

export default proto;
