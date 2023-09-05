import { GOOGLE_CLIENT_ID } from '@/config';
import { useEffect, useState } from 'react';

const GoogleOneTapButton = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const handleCredentialResponse = (response) => {
      console.log('Encoded JWT ID token: ' + response.credential);
      setIsSignedIn(true);
    };

    const initGoogleOneTap = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.prompt();
    };

    initGoogleOneTap();
  }, []);

  const handleGoogleLogin = () => {
    window.location.href =
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=998041040341-2lbq325g9238esd80epg00qqpqiam0ni.apps.googleusercontent.com&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile&redirect_uri=http://localhost:3000';
  };

  return (
    <div>
      {isSignedIn ? (
        <p>You are signed in.</p>
      ) : (
        <div>
          <button onClick={handleGoogleLogin}>Sign in with Google</button>
          <script src="https://accounts.google.com/gsi/client" async defer />
        </div>
      )}
    </div>
  );
};

export default GoogleOneTapButton;