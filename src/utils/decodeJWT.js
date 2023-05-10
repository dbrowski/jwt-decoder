import * as jose from "jose";

export const decodeJWT = (jwt) => {
  const headers = jose.decodeProtectedHeader(jot);
  const claims = jose.decodeJwt(jot);
  const jotComponents = jot.split(".");
  const sig = jotComponents.length >= 2 ? jotComponents[2] : "";
  return { headers, claims, sig };
};

export default decodeJWT;
