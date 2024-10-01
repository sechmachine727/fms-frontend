import { addHours, format, parseISO } from 'date-fns';

export const convertToVietnamTime = (dateString) => {
 
  const date = parseISO(format(dateString, 'yyyy-MM-dd'));
  const dateWithTimezone = addHours(date, 7);
  return format(dateWithTimezone, "yyyy-MM-dd'T'HH:mm:ss.SSS");
};