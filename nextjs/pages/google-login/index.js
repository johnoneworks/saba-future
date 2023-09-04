import { GOOGLE_CLIENT_ID, GOOGLE_GSI_URL } from "@/config";
import { useEffect } from "react";

const GoogleLoginButton = ({ onSuccess, onFailure }) => {
    useEffect(() => {
        // Load Google Sign-In API script
        const script = document.createElement("script");
        script.src = GOOGLE_GSI_URL;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        // Initialize Google Sign-In API
        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleSignIn
            });
        };

        // Handle Google Sign-In callback
        const handleGoogleSignIn = (response) => {
            if (response.error) {
                onFailure(response.error);
            } else {
                // Get Google user profile information，寄給 server
                console.error("token: ", response.credential);

                // Disable auto select and add sign out button
                const googleAccountsId = window.google.accounts.id;
                googleAccountsId.disableAutoSelect();
                const signOutButton = document.createElement("button");
                signOutButton.innerText = "Sign Out";
                signOutButton.onclick = () => {
                    googleAccountsId.signOut();
                };
                document.querySelector(".g_id_signin").appendChild(signOutButton);
            }
        };

        // Clean up
        return () => {
            document.body.removeChild(script);
        };
    }, [GOOGLE_CLIENT_ID, onFailure]);

    // Render Google Sign-In button
    return (
        <div
            className="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="outline"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-logo_alignment="left"
        />
    );
};

export default GoogleLoginButton;
