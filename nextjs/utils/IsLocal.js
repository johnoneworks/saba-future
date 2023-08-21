export const IsLocal = () => {
    const environment = process.env.NODE_ENV;
    return environment === "development";
};
