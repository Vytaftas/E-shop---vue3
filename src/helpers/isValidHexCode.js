export default (str) => {
    const regexp = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    return regexp.test(str);
};
