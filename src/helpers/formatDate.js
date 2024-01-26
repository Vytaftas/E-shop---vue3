export default (originalDate) => {
    const date = new Date(originalDate);
    return `${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
};
