export const parseCustomDate = (dateStr: string): Date => {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split(':');
    const [hours, minutes, seconds] = timePart.split(':');
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));
};