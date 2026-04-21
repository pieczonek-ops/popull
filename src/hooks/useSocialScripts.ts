import { useEffect } from 'react';

export function useSocialScripts() {
  useEffect(() => {
    // Load Twitter
    if (!document.getElementById('twitter-wjs')) {
      const script = document.createElement('script');
      script.id = 'twitter-wjs';
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.defer = true;
      script.charset = 'utf-8';
      document.head.appendChild(script);
    }

    // Load Facebook
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/pl_PL/sdk.js#xfbml=1&version=v19.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, []);
}
