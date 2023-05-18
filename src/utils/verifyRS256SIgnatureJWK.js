import * as jose from "jose";
import * as rs from "jsrsasign";

import decodeJWT from "./decodeJWT";

export const verifyRS256SignatureJWK = async (
  jwt,
  publicKey,
  ignoreExpiration
) => {
  const { headers, claims, sig } = decodeJWT(jwt);
  const jwk = publicKey.jwk;
  const { e, n } = jwk;
  const rsaPublicKey = await jose.importJWK(
    {
      kty: "RSA",
      e: e,
      n: n,
    },
    "RS256"
  );
  const clockTolerance = ignoreExpiration ? Number.POSITIVE_INFINITY : 0;
  const { _payload, _protectedHeader } = await jose.jwtVerify(
    jwt,
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
