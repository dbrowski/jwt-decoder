import * as jose from "jose";
import * as rs from "jsrsasign";

import decode from "./decodeJWT";

export const verifyRS256SignatureJWK = async (
  jwt,
  publicKey
) => {
  const { headers, claims, sig } = decodeJWT(jwt);
  const jwk = publicKey.jwk;
  const rsaPublicKey = await jose.importJWK(
    {
      kty: "RSA",
      e: e,
      n: n,
    },
    "RS256"
  );
  const clockTolerance = checkExpired ? 0 : Number.POSITIVE_INFINITY;
  const { _payload, _protectedHeader } = await jose.jwtVerify(
    jot,
    rsaPublicKey,
    {
      issuer: claims.iss,
      audience: claims.aud,
      clockTolerance: clockTolerance,
    }
  );

  // if jwtVerify doesn't throw an exception, then the signature has
  // been successfully verified
  return true;
};

export default verifyRS256SignatureJWK;
