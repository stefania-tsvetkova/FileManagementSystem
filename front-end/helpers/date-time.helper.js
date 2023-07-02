const locale = 'en-GB';

const options = {
    day: '2-digit',
    month: "2-digit",
    year: "numeric",
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
};

export class DateTimeHelper {
    formatDateTimeString(dateTimeString) {
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleDateString(locale, options);
    }

    compareDateTimeStrings(dateTimeString1, dateTimeString2) {
        const dateTime1 = new Date(dateTimeString1);
        const dateTime2 = new Date(dateTimeString2);

        if (dateTime1 === dateTime2) {
            return 0;
        }
        
        return dateTime1 < dateTime2 ? -1 : 1;
    }
}