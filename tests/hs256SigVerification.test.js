const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;
const crypto = require("crypto");
const jose = require("jose");
const rs = require("jsrsasign");
const JWS = rs.jws.JWS;

const genHS256JWTHeaderAndPayload = () => {
  const clientID = crypto.randomUUID();
  const envID = crypto.randomUUID();
  const sub = crypto.randomUUID();
  const sid = crypto.randomUUID();
  const org = crypto.randomUUID();
  const iat = Date.now();
  const exp = iat + 100000;

  return { b64Header, b64Payload };
};

describe("HS256 Signature Verification", () => {
  const clientID = crypto.randomUUID();
  const envID = crypto.randomUUID();
  const sub = crypto.randomUUID();
  const sid = crypto.randomUUID();
  const org = crypto.randomUUID();
  const iat = Date.now();
  const dur = 100000;
  const exp = iat + dur;
  const header = {
    alg: "HS256",
  };
  const payload = {
    client_id: clientID,
    iss:
      "https://auth.pingone.com/" +
      envID +
      "d048b66f-b3f1-4005-b076-a0fdd9017d3b/as",
    iat,
    exp,
    aud: ["https://api.pingone.com"],
    scope:
      "address p1:read:device p1:update:user openid p1:read:oauthConsent p1:update:userMfaEnabled profile p1:read:userConsent p1:read:userLinkedAccounts p1:read:user p1:update:device p1:reset:userPassword p1:read:sessions p1:update:oauthConsent phone email",
    sub,
    sid,
    env: envID,
    org: org,
  };
  const b64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  const b64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  describe("Random UUIDs", () => {
    it("should have random UUIDs", () => {
      expect(clientID).to.be.a("string");
      expect(clientID).to.have.length(36);
      expect(envID).to.be.a("string");
      expect(envID).to.have.length(36);
      expect(sub).to.be.a("string");
      expect(sub).to.have.length(36);
      expect(sid).to.be.a("string");
      expect(sid).to.have.length(36);
      expect(org).to.be.a("string");
      expect(org).to.have.length(36);
      expect(iat).to.be.a("number");
      expect(exp).to.be.a("number");
      expect(exp).to.be.equal(iat + dur);
    });
  });

  describe("JWT Header", () => {
    it("should have alg: HS256", () => {
      expect(header).to.have.property("alg");
      expect(header.alg).to.be.equal("HS256");
    });
  });

  describe("JWT Payload", () => {
    describe("client_id", () => {
      it("should be a string", () => {
        expect(payload.client_id).to.be.a("string");
      });
    });

    describe("client_id", () => {
      it("should be a string", () => {
        expect(payload.iss).to.be.a("string");
      });
    });

    describe("iat", () => {
      it("should be a number", () => {
        expect(payload.iat).to.be.a("number");
      });
    });

    describe("exp", () => {
      it("should be a number", () => {
        expect(payload.exp).to.be.a("number");
      });
    });

    describe("aud", () => {
      it("should be an array", () => {
        expect(payload.aud).to.be.a("array");
      });
    });

    describe("scope", () => {
      it("should be a string", () => {
        expect(payload.scope).to.be.a("string");
      });
    });

    describe("scope", () => {
      it("should be a string", () => {
        expect(payload.sub).to.be.a("string");
      });
    });

    describe("scope", () => {
      it("should be a string", () => {
        expect(payload.sid).to.be.a("string");
      });
    });

    describe("scope", () => {
      it("should be a string", () => {
        expect(payload.env).to.be.a("string");
      });
    });

    describe("scope", () => {
      it("should be a string", () => {
        expect(payload.org).to.be.a("string");
      });
    });
  });

  describe("JWT Verification", () => {
    const sigInput = b64Header + "." + b64Payload;
    const numBytesInSecret = 32;
    const rndBytes = crypto.randomBytes(numBytesInSecret);
    const secretHex = rndBytes.toString("hex");
    const secretUTF8 = rndBytes.toString("utf8");
    const secretKey = crypto.createSecretKey(rndBytes);

    // hmac using keyobject secret
    const hmacWithKeyObj = crypto.createHmac("sha256", secretKey);
    hmacWithKeyObj.update(sigInput);
    const sigKeyObj = hmacWithKeyObj.digest("base64url");
    const jwtKeyObj = sigInput + "." + sigKeyObj;

    // hmac using hex secret
    const hmacWithHexKey = crypto.createHmac("sha256", secretHex, {
      encoding: "hex",
    });
    hmacWithHexKey.update(sigInput);
    const sigHex = hmacWithHexKey.digest("base64url");
    const jwtHex = sigInput + "." + sigHex;

    // hmac using utf8 secret
    const hmacWithUTF8Key = crypto.createHmac("sha256", secretUTF8);
    hmacWithUTF8Key.update(sigInput);
    const sigUTF8 = hmacWithUTF8Key.digest("base64url");
    const jwtUTF8 = sigInput + "." + sigUTF8;

    it("should successfully verify the HS256 signed JWT using secret from key object hex encoding", () => {
      expect(
        JWS.verify(
          jwtKeyObj,
          { hex: secretKey.export({ format: "buffer" }).toString("hex") },
          ["HS256"]
        ),
        "secret: " + secretKey.export({ format: "buffer" }).toString("hex")
      ).to.be.true;
    });
    it("should successfully verify the HS256 signed JWT using secret in hex encoding", () => {
      expect(
        JWS.verify(jwtHex, { hex: secretHex }, ["HS256"]),
        "secret: " + secretHex
      ).to.be.true;
    });
    it("should successfully verify the HS256 signed JWT using secret in utf8 encoding", () => {
      expect(
        JWS.verify(jwtUTF8, { utf8: secretUTF8 }, ["HS256"]),
        "secret: " + secretUTF8
      ).to.be.true;
    });
  });
});
