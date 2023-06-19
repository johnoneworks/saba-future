const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ ((Math.random() * 16) >> (c / 4))).toString(16)).replace(/-/g, "");
};

export default uuidv4;
