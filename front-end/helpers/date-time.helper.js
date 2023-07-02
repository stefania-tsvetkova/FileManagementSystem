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
    formatDateTime(dateTimeString) {
        const dateTime = new Date(dateTimeString);
        return dateTime.toLocaleDateString(locale, options);
    }
}