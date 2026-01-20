/**
 * Format date to IST (UTC +05:30)
 * Expected format: DD MMM YYYY, hh:mm AM/PM IST
 */
export const formatToIST = (date: Date | string | number): string => {
    const d = new Date(date);

    // Options for formatting
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    };

    const formatted = new Intl.DateTimeFormat('en-GB', options).format(d);

    // The format from en-GB with Asia/Kolkata timezone is usually something like "19 Jan 2026, 09:44 pm" or "19 Jan 2026, 21:44"
    // We need to ensure it's "DD MMM YYYY, hh:mm AM/PM IST"

    // Custom split and rebuild to ensure exact format if necessary
    const parts = formatted.split(', ');
    const datePart = parts[0]; // "19 Jan 2026"
    const timePart = parts[1].toUpperCase(); // "09:44 PM" or "21:44"

    return `${datePart}, ${timePart} IST`;
};
