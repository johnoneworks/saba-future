import axios from "axios";
import { API_URL_DOMAIN } from "../constants/api.js";

const baseAxios = async ({ method, url, header = {}, data }) => {
    const response = await axios({
        method: method,
        url: API_URL_DOMAIN + url,
        data: data,
        headers: {
            "Content-Type": "application/json",
            ...header
        }
    });
    return response.data;
};

export default baseAxios;
