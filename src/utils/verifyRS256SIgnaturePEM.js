import * as jose from "jose";
import * as rs from "jsrsasign";

import decodeJWT from "./decodeJWT";

export const verifyRS256SignaturePEM = async (jwt, publicKey) => {
  const JWS = rs.KJUR.jws.JWS;
  const { headers, claims, sig } = decodeJWT(jwt);
  const pem = publicKey.pem;
  const rsaKey = rs.KEYUTIL.getKey(pem);
  const isValid = JWS.verify(jwt, rsaKey, ["RS256"]);
  return isValid;
};

export default verifyRS256SignaturePEM;
