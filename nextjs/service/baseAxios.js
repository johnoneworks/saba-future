import { currentDate } from "@/utils/ConvertDate";
import uuidv4 from "@/utils/Uuid";
import axios from "axios";
import { API_URL_DOMAIN } from "../constants/api.js";

const baseAxios = async ({ method, url, header = {}, token, data = {} }) => {
    try {
        const response = await axios({
            method: method,
            url: API_URL_DOMAIN + url,
            headers: {
                "Content-Type": "application/json",
                ...header
            },
            data: {
                TimeStamp: currentDate(),
                Seq: uuidv4(),
                Token: token,
                ...data
            }
        });
        return response.data;
    } catch (error) {
        console.error(`api is ${method} method and api url is ${API_URL_DOMAIN + url} and error is ${error}`);
        console.log("%c⧭ error data", "color: #cc0036", data);
    }
};

export default baseAxios;
