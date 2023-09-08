import { API_GET_CUSTOMER_TICKETS } from "@/constants/api";
import baseAxios from "../baseAxios";

const syncCustomerTickets = async () => {
    const response = await baseAxios({
        method: "POST",
        url: API_GET_CUSTOMER_TICKETS
    });
    return response;
};

export default syncCustomerTickets;
