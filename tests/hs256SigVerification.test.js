const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const jose = require("jose");
const rs = require("jsrsasign");
const crypto = require("crypto");

describe("HS256 Signature Verification", () => {
  it("should successfully verify the HS256 signed JWT", () => {
    const header = {
      alg: "HS256",
    };
    const payload = {
      client_id: "d048b66f-b3f1-4005-b076-a0fdd9017d3b",
      iss: "https://auth.pingone.com/d048b66f-b3f1-4005-b076-a0fdd9017d3b/as",
      iat: 1682180846,
      exp: 1682184446,
      aud: ["https://api.pingone.com"],
      scope:
        "address p1:read:device p1:update:user openid p1:read:oauthConsent p1:update:userMfaEnabled profile p1:read:userConsent p1:read:userLinkedAccounts p1:read:user p1:update:device p1:reset:userPassword p1:read:sessions p1:update:oauthConsent phone email",
      sub: "d048b66f-b3f1-4005-b076-a0fdd9017d3b",
      sid: "d048b66f-b3f1-4005-b076-a0fdd9017d3b",
      env: "d048b66f-b3f1-4005-b076-a0fdd9017d3b",
      org: "d048b66f-b3f1-4005-b076-a0fdd9017d3b",
    };
    const b64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
    const b64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64url"
    );
    const sigInput = b64Header + "." + b64Payload;
    const secret = "a secret";
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(sigInput);
    const sig = hmac.digest("base64url");
    const jwt = sigInput + "." + sig;

    const JWS = rs.jws.JWS;
    expect(JWS.verify(jwt, { utf8: secret }, ["HS256"])).to.be.true;
  });
});
