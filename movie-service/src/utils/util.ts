/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

type FirstLast = 0 | 1;

/**
 * @returns Date equals to first day of month if the day parameter is 0.
 * @returns Date equals to last day of month if the day parameter is 1.
 *
 * @example
 * For example today is 03.07.2021
 * getFirstLastDay(0) // Thu Jul 01 2021 00:00:00
 * getFirstLastDay(1) // Sat Jul 31 2021 00:00:00
 */
export const getFirstLastDay = (day: FirstLast): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + day, day === 0 ? 1 : 0);
};
