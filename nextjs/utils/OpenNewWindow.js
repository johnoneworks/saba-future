export const OpenNewWindow = (url, name) => {
    const existingPage = window.open("", name);
    if (existingPage) {
        existingPage.location.href = url;
        existingPage.focus();
    } else {
        window.open(url, name);
    }
};
