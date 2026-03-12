import * as dayjs from "dayjs";
import * as weekOfYear from "dayjs/plugin/weekOfYear";
import * as isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import * as duration from "dayjs/plugin/duration";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import * as isBetween from "dayjs/plugin/isBetween";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";

dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
export default dayjs;
export type Dayjs = dayjs.Dayjs;
export const parseDate = (_value: string | number | dayjs.Dayjs | Date | null) => {
  if (_value) return dayjs(_value);
  return _value;
};
