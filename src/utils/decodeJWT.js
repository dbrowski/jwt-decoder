import * as jose from "jose";

export const decodeJWT = (jwt) => {
  const headers = jose.decodeProtectedHeader(jwt);
  const claims = jose.decodeJwt(jwt);
  const jwtComponents = jwt.split(".");
  const sig = jwtComponents.length >= 2 ? jwtComponents[2] : "";
  return { headers, claims, sig };
};

export default decodeJWT;
