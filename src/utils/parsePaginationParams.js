const parseNumber = (number, defaultValue) => {
    const isString = typeof number === 'string';
    if (!isString) return defaultValue;

    const parsedNumber = parseInt(number);
    if(Number.isNaN(parseNumber)) {
        return defaultValue;
    }
    return parsedNumber;
}