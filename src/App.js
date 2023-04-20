import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { makeStyles } from "@material-ui/core/styles";
import * as jwtDecoder from "jwt-js-decode";
import JSONPretty from "react-json-pretty";
import JSONPrettyMon from "./App.css";
import * as rs from "jsrsasign";
import CircularIntegration from "./LoadingButton";

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
    display: "flex",
    height: "100%",
    maxWidth: "100%",
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
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
    "eyJraWQiOiJkZWZhdWx0IiwiYWxnIjoiUlMyNTYifQ.eyJhdWQiOiJodHRwczpcL1wvYXBpLnBpbmdvbmUuY29tIiwib3JnIjoiYTZmZGNkZTgtMGFlMi00YjNjLTgxZGMtYjM0NjhmY2U2N2Y5IiwiaXNzIjoiaHR0cHM6XC9cL2F1dGgucGluZ29uZS5jb21cLzc4ZTE4YmIxLTA5NDMtNGNhYy04ODAzLWE5Y2U2ZjRiMjczMVwvYXMiLCJleHAiOjE2MDAwMjI3MTMsImVudiI6Ijc4ZTE4YmIxLTA5NDMtNGNhYy04ODAzLWE5Y2U2ZjRiMjczMSIsImlhdCI6MTYwMDAxOTExMywiY2xpZW50X2lkIjoiOTc0MTYyYjAtODgyMC00ZWE1LTljZGEtY2JhM2M1ODlmNmFmIn0.Rh5h_oNpgEoR01rYU7ScbNdJ6kNeocNhV9cmw9pXw80vjN3KBDOauXmZfZugmRviHKrdIpXae-N2hN5xiS8BeocTu2khhyl69dLFu9sX1RON0JwmjStcKEIRSBJTU1ddEhVoedSvlXx5QDJ-nH_lz9DjV1qzrGMI1-M7JTtTmPN68klGNG-_DaTzJMZbBFxWN6dhgfmBBadcCUbpnPlTpSUCJtpXfJm-uUdMcDSG0ZZ3trhqtS9Eq2WyRM88zEYDtPMPfCVMQ6eXotDE8xGfPIWI_nCd9-ALBUFATKh_RVl1m1-5MmwqceoRmH2C_CXomsLPFwsF_rGJt39FzWC4DQ";

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
  const [passphrase, setPassphrase] = useState("");
  const [verifiedSignature, setVerifiedSignature] = useState(false);

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

  const handlePassphraseChange = (event) => {
    event.preventDefault();
    setPassphrase(event.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const decode = () => {
    let dj = jwtDecoder.jwtDecode(jot);
    let header = dj.header;
    // let payload = dj.payload;
    // let signature = dj.signature;

    setDecodedJot(dj);

    if (header.alg === "RS256") {
      setRS256(true);
    }

    if (header.alg === "HS256") {
      setHS256(true);
    }
  };

  const handleValidateJWT = async (event) => {
    event.preventDefault();
    setVerifiedSignature(false);

    let verified = false;

    try {
      verified = decryptJWS(event);
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

    return verified;
  };

  const decryptJWS = (event) => {
    const JWS = rs.jws.JWS;
    let isValid = false;

    if (rs256) {
      if (key) {
        const rsaKey = rs.KEYUTIL.getKey(key);
        isValid = JWS.verify(jot, rsaKey, ["RS256"]);
        setVerifiedSignature(isValid);
      } else {
        let msg = "Need a RSA certificate to verify the JWT signature.";
        setJotError(msg);
        setAnchorEl(event.currentTarget);
        setVerifiedSignature(false);
        console.error(msg);
      }
    } else if (hs256) {
      if (passphrase) {
        isValid = JWS.verify(jot, { utf8: passphrase }, ["HS256"]);
        setVerifiedSignature(isValid);
      } else {
        let msg = "Need a passphrase to verify the JWT signature.";
        setJotError(msg);
        setAnchorEl(event.currentTarget);
        setVerifiedSignature(false);
        console.error(msg);
      }
    } else {
      let msg = "Didn't recognize the algorithm. Use RS256 or HS256.";
      setJotError(msg);
      setAnchorEl(event.currentTarget);
      setVerifiedSignature(false);
      console.error(msg);
    }

    return isValid;
  };

  return (
    <Grid container component="main" className={classes.root}>
      <Grid
        item
        container
        xs={12}
        component={Paper}
        elevation={6}
        square
        justify="flex-start"
        style={{ maxWidth: "100%" }}
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
                  marginTop="0rem"
                  marginBottom="0rem"
                  padding="1rem"
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
                  marginTop="0rem"
                  marginBottom="1rem"
                  padding="1rem"
                  maxWidth="100%"
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
              <Grid
                item
                xs={12}
                style={{ flex: "10 0 auto", paddingBottom: "1rem" }}
              >
                <Typography>Signature</Typography>
                <TextField
                  variant="outlined"
                  margin="none"
                  required
                  fullWidth
                  id="signature"
                  label="Signature"
                  name="Signature"
                  value={decodedJot ? decodedJot.signature : ""}
                  autoFocus
                  rowsMax={1}
                  multiline
                  onChange={handleJWTChange}
                />
              </Grid>
              {decodedJot && rs256 ? (
                <>
                  <Grid item xs={12} style={{ flex: "10 0 auto" }}>
                    <Typography>Public Key</Typography>
                    <TextField
                      variant="outlined"
                      margin="none"
                      color={verifiedSignature ? "primary" : "secondary"}
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

              {decodedJot && hs256 ? (
                <>
                  <Grid
                    item
                    xs={12}
                    style={{ flex: "10 0 auto", paddingBottom: "1rem" }}
                  >
                    <Typography>Passphrase</Typography>
                    <TextField
                      variant="outlined"
                      margin="none"
                      color={verifiedSignature ? "primary" : "secondary"}
                      required
                      fullWidth
                      id="passphrase"
                      label="Passphrase"
                      name="passphrase"
                      value={passphrase}
                      autoFocus
                      rowsMax={4}
                      multiline
                      onChange={handlePassphraseChange}
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}
              <Grid
                item
                xs={12}
                style={{ flex: "1 0 auto", paddingBottom: "1rem" }}
              >
                <CircularIntegration verifySignature={handleValidateJWT} />
              </Grid>
              <Grid
                item
                xs={12}
                style={{ flex: "1 0 auto", paddingBottom: "1rem" }}
              >
                <Box>
                  {verifiedSignature ? (
                    <Typography color="primary">
                      Signature Verified{" "}
                      <CheckIcon style={{ paddingTop: ".25rem" }} />
                    </Typography>
                  ) : (
                    <Typography color="secondary">
                      Signature not verified
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}
