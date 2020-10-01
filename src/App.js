import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { makeStyles } from "@material-ui/core/styles";
import * as jwtDecoder from "jwt-js-decode";
import JSONPretty from "react-json-pretty";
import JSONPrettyMon from "./App.css";
import base64url from "base64url";
const crypto = require("crypto");
const rs = require("jsrsasign");
const rsu = require("jsrsasign-util");

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: "100vw",
  },
  image: {
    backgroundImage:
      "url(https://pingidentity.com/content/dam/ping-6-2-assets/open-graph-images/2019/P14C-Build-OG.png)",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#576877",
    backgroundSize: "cover",
    backgroundPosition: "center",
    maxHeight: "20vw",
  },
  paper: {
    margin: theme.spacing(0, 2),
    display: "flex",
    height: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    color: "#2E4355",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#2E4355",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(0),
  },
  submit: {
    backgroundColor: "#2E4355",
    margin: theme.spacing(3, 0, 2),
  },
  typography: {
    color: "#2E4355",
    fontSize: "1rem",
  },
  errorMessage: {
    color: "red",
  },
  infoPaperContainer: {
    maxHeight: "100%",
    overflow: "auto",
  },
  info: {
    height: "100%",
    maxHeight: "100%",
    color: "#2E4355",
    margin: "0",
    padding: "0",
  },
}));

export default function App() {
  // Use the above styles.
  const classes = useStyles();

  const exampleJWT =
    "eyJraWQiOiJkZWZhdWx0IiwiYWxnIjoiUlMyNTYifQ.eyJhdWQiOiJodHRwczpcL1wvYXBpLnBpbmdvbmUuY29tIiwib3JnIjoiYTZmZGNkZTgtMGFlMi00YjNjLTgxZGMtYjM0NjhmY2U2N2Y5IiwiaXNzIjoiaHR0cHM6XC9cL2F1dGgucGluZ29uZS5jb21cLzMzM2Q2NmI1LWQyZjAtNDhkMC04ZWMwLWNmNGNhZmQzNWQyNVwvYXMiLCJleHAiOjE2MDE1NzE2NzgsImVudiI6IjMzM2Q2NmI1LWQyZjAtNDhkMC04ZWMwLWNmNGNhZmQzNWQyNSIsImlhdCI6MTYwMTU2ODA3OCwiY2xpZW50X2lkIjoiMmI0Y2M3OWEtNzc2Mi00OGUxLWE5NjYtNmI4YzBhN2U0ZDEyIn0.H54cYnelqCCiYbCIaQbAI9aydrKCSPktqFNAED_ZDCp25iZeBS6PSMb-XalH9pIoa4qX-OUOGPpax-0VNbXvvbkv8bnjNBrJOr7J4tAx0bpT62D3vyTvyhps77-BgjY-4dNN9-yMQiz5mNG0Y5EQegViCZiYeUbymsbziaXcIcNPWrTth4slFUkw--Ths3B9KyjIjU5p78yM02jdJou5C7O5c7517aMaI7FonzRyUc3Bw7ipoWQiRT3-gBr-Ho8Aboslx9uTMTn-j-eCMDDxYeUV-lnes4QhLfKwNGxLwAm0AuQ3R19pQynV4V_XVxbfLzqGrwRA85R-tOtdX5iZMA";

  const examplePubKey =
    "MIIDLDCCAhSgAwIBAgIGAWW17v5GMA0GCSqGSIb3DQEBCwUAMFcxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDTzEPMA0GA1UEBxMGRGVudmVyMRUwEwYDVQQKEwxQaW5nSWRlbnRpdHkxEzARBgNVBAMTCnByb2Qtb2F1dGgwHhcNMTgwOTA3MjEyNzQzWhcNMjMwOTA2MjEyNzQzWjBXMQswCQYDVQQGEwJVUzELMAkGA1UECBMCQ08xDzANBgNVBAcTBkRlbnZlcjEVMBMGA1UEChMMUGluZ0lkZW50aXR5MRMwEQYDVQQDEwpwcm9kLW9hdXRoMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjgQ8twHSmSlT28I7iTi4+IsA3jgfhGPx0pIC27LTDf0q4wBE8Ap5dG7kqL9GE7zoxleghUs6APQ0qKWaTxBSqxISzZmZpRQqipM+Tog3wgLciIbRozRHTXmCmzFJcG5spoe2XtcZ3zMRs9kkOUzxN2XMXHBidQKFB82/NjDwqhW/gdbS1vJLt1j9gjl60wvXcTwFzTkqh6owGjMCVFrraEv+H6XdhP4VMM7gsPOSD+IJke0CmQyVMVXVWoydahMLqLuz59HBUCYFcW0HVJLDMKJvNoFhY9xZW3oiVrNPP7COdv5+4SLq3EIi5WVd9TglYDQt2SmyDV36pcBPautKvQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQB42oNEjRUNRbMEnrQ6UyyyVu+DW6lL19RJoCasb4hRWe/YHr11xF3+JMObsaaRBA0/jJ7SAFiJxNpBC48ceXDK+mS3VbGDBj+Isi19Csa1HO0VpERKuNuaXmUGmJm4hkMcYFbnjC9+g/3bzDDiZWAiZUrqVA6HEj4MXb5/m7492msSFnhZ06qjAVj/qpRcVBIAIy1XCvTB2X913x4r+CjrWd0x3nHcjr2qfnmw96qPQU82MagWXenNNZbLpy+rDbWjYDB/bW3Rgp4704PLixar5gGR69x3JCvfr7N45oOYTQcZmTasF7W5Ee2bsR2NXu1KvI7fLgLifz25V/eqYtjY";

  // State variables and setters.
  const [jot, setJot] = useState("");
  const [decodedJot, setDecodedJot] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [jotError, setJotError] = React.useState(null);
  const [rs256, setRS256] = useState(false);
  const [hs256, setHS256] = useState(false);
  const [key, setKey] = useState("");

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      setJot(exampleJWT);
      decode();
    } catch (e) {
      // Gets the reason for failure.
      let msg = e.message.split(". ")[1];
      console.error(msg);
      setJotError(msg);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleJWTChange = (event) => {
    event.preventDefault();
    setJot(event.target.value);
  };
  const handleKeyChange = (event) => {
    event.preventDefault();
    setKey(event.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const decode = () => {
    let dj = jwtDecoder.jwtDecode(jot);
    let header = dj.header;
    let payload = dj.payload;
    let signature = dj.signature;

    setDecodedJot(dj);

    if (header.alg === "RS256") {
      setRS256(true);
    }

    if (header.alg == "HS256") {
      setHS256(true);
    }
  };

  const handleValidateJWT = (event) => {
    event.preventDefault();
    try {
      decryptJWS(event);
    } catch (e) {
      // Gets the reason for failure.
      let msg = "";
      if (e.message) {
        msg = e.message.split(". ")[1] || e.message.split(". ")[0];
        console.error(msg);
      } else {
        msg = e;
      }
      setJotError(msg);
      setAnchorEl(event.currentTarget);
    }
  };

  const decryptJWS = (event) => {
    // const dj = jwtDecoder.jwtDecode(jot);
    // const header1 = dj.header;
    // let payload = dj.payload;
    // let signature = dj.signature;
    const header = jot.split(".")[0];
    const payload = jot.split(".")[1];
    const signature = jot.split(".")[2];

    // const verifyFunction = crypto.createVerify("SHA256");
    const JWS = rs.jws.JWS;

    let decodedSignature = base64url.decode(signature);
    const decodedHeader = base64url.decode(header);

    console.log("decodedSignature");
    console.log(decodedSignature);

    if (key) {
      // console.log(decodedHeader.alg);
      console.log("key");
      console.log(key);

      if (rs256) {
        const acceptField = { alg: ["RS256"], verifyAt: "1601571677" };
        const pemString =
          "-----BEGIN CERTIFICATE-----\n" +
          examplePubKey +
          "\n-----END CERTIFICATE-----";
        console.log("pemString");
        console.log(pemString);
        const rsaKey = rs.KEYUTIL.getKey(pemString);
        console.log("rsaKey");
        console.log(rsaKey);

        const isValid = JWS.verifyJWT(jot, rsaKey, acceptField);
        const isValid2 = JWS.verify(jot, rsaKey, ["RS256"]);

        console.log("isValid");
        console.log(isValid);

        console.log("isValid2");
        console.log(isValid2);

        let headerBase64Encoded = base64url.toBase64(header);
        let payloadBase64Encoded = base64url.toBase64(payload);

        const headerAndPayload = header + "." + payload;
        console.log("headerAndPayload");
        console.log(headerAndPayload);

        // verifyFunction.update(headerAndPayload, "base64");
        // verifyFunction.end();

        // const signatureBase64 = base64url.toBase64(signature);

        // const signatureIsValid = verifyFunction.verify(
        //   key,
        //   signature,
        //   "base64"
        // );

        // console.log(signatureIsValid);

        // jwtDecoder.jwtVerify(jot, key).then((res) => {
        //   if (res === true) {
        //     const jwt = jwtDecoder.jwtDecode("token");
        //     console.log(jwt.payload);
        //   } else {
        //     console.log("could not validate");
        //   }
        // });
      }

      if (hs256) {
      }
    } else {
      let msg = "Need a key to try to verify the JWT.";
      setJotError(msg);
      setAnchorEl(event.currentTarget);
      console.log("Need key.");
    }
  };

  const decryptJWE = () => {};

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />

      <Grid
        item
        container
        xs={12}
        component={Paper}
        elevation={6}
        square
        justify="flex-start"
      >
        <Grid
          item
          container
          justify="flex-start"
          className={classes.paper}
          direction="column"
        >
          <Grid
            item
            container
            xs={12}
            justify="center"
            style={{
              flex: "0 1 0",
            }}
          >
            <Avatar className={classes.avatar}>
              <LockOpenIcon />
            </Avatar>
          </Grid>
          <Grid item xs={12} style={{ flex: "0 10 0" }}>
            <Typography component="h4" variant="h4" align="center">
              JWT Decoder
            </Typography>
          </Grid>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid
              item
              container
              direction="column"
              alignItems="stretch"
              xs={12}
              style={{ flex: "10 0 auto" }}
            >
              <Grid item xs={12} style={{ flex: "10 0 auto" }}>
                {/* JWT input field */}
                <TextField
                  variant="outlined"
                  margin="none"
                  required
                  fullWidth
                  id="jwt"
                  label="JWT"
                  name="JWT"
                  value={jot}
                  autoFocus
                  rowsMax={4}
                  multiline
                  onChange={handleJWTChange}
                />

                {/* Error Message for JWT String Decode */}
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Typography className={classes.errorMessage}>
                    {jotError}
                  </Typography>
                </Popover>
              </Grid>
              <Grid item xs={12} style={{ flex: "1 0 auto" }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Decode
                </Button>
              </Grid>
              <Grid item xs={12} style={{ flex: "10 0 auto" }}>
                <Typography>Header</Typography>
                <Box
                  border={1}
                  borderRadius={5}
                  borderColor="#576877"
                  height="100%"
                  minHeight="10vh"
                  marginTop="0rem"
                  marginBottom="1rem"
                  padding="0"
                >
                  {decodedJot ? (
                    <JSONPretty
                      id="pretty-header"
                      data={decodedJot.header}
                      theme={JSONPrettyMon}
                      style={{
                        margin: 0,
                        padding: 0,
                        fontSize: "1rem",
                      }}
                      mainStyle="padding: 0, margin: 0"
                      valueStyle="padding: 0, margin: 0"
                    />
                  ) : (
                    ""
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} style={{ flex: "10 0 auto" }}>
                <Typography>Payload</Typography>
                <Box
                  border={1}
                  borderRadius={5}
                  borderColor="#576877"
                  height="100%"
                  minHeight="20vh"
                  marginTop="0rem"
                  marginBottom="1rem"
                >
                  {decodedJot ? (
                    <JSONPretty
                      id="pretty-payload"
                      data={decodedJot.payload}
                      theme={JSONPrettyMon}
                      style={{
                        margin: 0,
                        padding: 0,
                        fontSize: "1rem",
                      }}
                      mainStyle="padding: 0, margin: 0"
                      valueStyle="padding: 0, margin: 0"
                    />
                  ) : (
                    ""
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} style={{ flex: "10 0 auto" }}>
                <Typography>Signature</Typography>
                <Box
                  border={1}
                  borderRadius={5}
                  borderColor="#576877"
                  height="100%"
                  minHeight="10vh"
                  marginTop="0rem"
                  marginBottom="1rem"
                >
                  {decodedJot ? (
                    <Typography>{decodedJot.signature}</Typography>
                  ) : (
                    <Typography></Typography>
                  )}
                </Box>
              </Grid>
              {decodedJot ? (
                <>
                  <Grid item xs={12} style={{ flex: "10 0 auto" }}>
                    <Typography>Public Key</Typography>
                    <TextField
                      variant="outlined"
                      margin="none"
                      required
                      fullWidth
                      id="key"
                      label="KEY"
                      name="key"
                      value={key}
                      autoFocus
                      rowsMax={4}
                      multiline
                      onChange={handleKeyChange}
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}
              <Grid item xs={12} style={{ flex: "1 0 auto" }}>
                <Button
                  type="button"
                  onClick={handleValidateJWT}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Verify Signature
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}
