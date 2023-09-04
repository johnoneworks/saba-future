import { API_SAVE_ACCOUNT } from "@/constants/api";
import uuidv4 from "@/utils/Uuid";
import baseAxios from "./baseAxios";

const syncCustInfo = async ({ currentDate, walletId, email }) => {
    const data = {
        TimeStamp: currentDate,
        Seq: uuidv4(),
        WalletId: walletId,
        Email: email
    };
    const response = await baseAxios({
        method: "POST",
        url: API_SAVE_ACCOUNT,
        data: data
    });

    return response;
};

export default syncCustInfo;
