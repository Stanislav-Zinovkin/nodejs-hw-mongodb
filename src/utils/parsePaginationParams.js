 export const parseNumber = (number, defaultValue) => {
    const parsed = parseInt(number, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
};