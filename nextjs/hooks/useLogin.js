import { GOOGLE_LOGIN, SESSION_STORAGE } from "@/constants/Constant";
import syncLogin from "@/service/login";
import { useAccountStore } from "@/store/useAccountStore";
import "@biconomy/web3-auth/dist/src/style.css";
import { useCallback } from "react";
import useGetUserBalance from "./useGetUserBalance";

const useLogin = () => {
    const { setAccount, setIsAdmin, setEmail, setIsNew, setToken } = useAccountStore();
    const { updateBalance } = useGetUserBalance();

    const googleLogin = useCallback(() => {
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_LOGIN.CLIENT_ID}&response_type=code&scope=${GOOGLE_LOGIN.SCOPE}&redirect_uri=${location.origin}`;
    });

    const setUserInfo = useCallback(() => {
        if (typeof window !== "undefined" && JSON.parse(sessionStorage.getItem(SESSION_STORAGE.LOGIN_INFO))) {
            const localUserData = JSON.parse(sessionStorage.getItem(SESSION_STORAGE.LOGIN_INFO));
            setAccount(localUserData.name);
            setEmail(localUserData.email);
            setIsAdmin(localUserData.isAdmin);
            setIsNew(localUserData.isNew);
            setToken(localUserData.token);
        }
    });

    const handleFetchLogin = useCallback(async (usercode) => {
        try {
            const response = await syncLogin({
                code: usercode,
                redirectUrl: location.origin
            });

            if (!!response && response.ErrorCode === 0) {
                const userData = {
                    email: response.Result.Email,
                    token: response.Result.Token,
                    name: response.Result.NickName,
                    isAdmin: response.Result.IsAdmin,
                    isNew: response.Result.IsNewUser
                };
                sessionStorage.setItem(SESSION_STORAGE.LOGIN_INFO, JSON.stringify(userData));
                setUserInfo();
                updateBalance();
            }
        } catch (error) {
            console.error(`Error login: ${error}`);
        }
    });

    return { googleLogin, handleFetchLogin, setUserInfo };
};

export default useLogin;
