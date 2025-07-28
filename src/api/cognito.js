const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN_URL;
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URL; // update for production
const RESPONSE_TYPE = import.meta.env.VITE_COGNITO_RESPONSE_TYPE;
const SCOPES = import.meta.env.VITE_COGNITO_SCOPE;

const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}`;

console.log("Cognito Login URL:", loginUrl);

export default loginUrl;
