import {generateQueryString} from "@/utils";

export const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
export const OAUTH_REDIRECT_GOOGLE_URL = BASE_URL + '/oauth/google';

export const SSO = {
  FACEBOOK: "facebook",
  GOOGLE: "google"
}

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

const SSO_GOOGLE_CONFIG = {
  redirect_uri: OAUTH_REDIRECT_GOOGLE_URL,
  prompt: "consent",
  response_type: "code",
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  scope: "openid%20profile%20email",
  access_type: "offline"
}

export const queriesSSOGoogleConfig = generateQueryString(SSO_GOOGLE_CONFIG);
