import { API_GET_CUSTOMER_TICKETS } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncCustomerTickets = async (token) => {
    const response = await baseAxios({
        method: "POST",
        url: API_GET_CUSTOMER_TICKETS,
        token: token
    });
    return response;
};

export default syncCustomerTickets;
