import { GOOGLE_LOGIN, SESSION_STORAGE } from "@/constants/Constant";
import syncLogin from "@/service/login";
import { useAccountStore } from "@/store/useAccountStore";
import "@biconomy/web3-auth/dist/src/style.css";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import useGetUserBalance from "./useGetUserBalance";

const useLogin = () => {
    const router = useRouter();
    const { setAccount, setIsAdmin, setEmail, setIsNew, setToken } = useAccountStore();
    const { updateBalance } = useGetUserBalance();
    const [userCode, setUserCode] = useState();

    const redirectGoogleLogin = useCallback(() => {
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

    const handleFetchLogin = useCallback(async (userCode) => {
        try {
            const response = await syncLogin({
                code: userCode,
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

    useEffect(() => {
        setUserInfo();
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
        if (!!code) setUserCode(code);
    }, [router.asPath]);

    useEffect(() => {
        handleFetchLogin(userCode);
    }, [userCode]);

    return { redirectGoogleLogin, handleFetchLogin, setUserInfo };
};

export default useLogin;
