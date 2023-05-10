import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import * as jose from "jose";
import JWTDecoderHeading from "./JWTDecoderHeading";
import JSONOutput from "./JSONOutput";
import DecodeButton from "./DecodeButton";
import SignatureVerification from "./SignatureVerification";
import decodeJWT from "./utils/decodeJWT";

const App = () => {
  // State variables and setters.
  const [jot, setJot] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [rs256, setRS256] = useState("");
  const [hs256, setHS256] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [jotError, setJotError] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  const decode = () => {
    // const headers = jose.decodeProtectedHeader(jot);
    // const claims = jose.decodeJwt(jot);
    // const jotComponents = jot.split(".");
    // const sig = jotComponents.length >= 2 ? jotComponents[2] : "";

    const { headers, claims, sig } = decodeJWT(jot);

    setDecodedHeader(headers);
    setDecodedPayload(claims);
    setSignature(sig);

    if (headers.alg === "RS256") {
      setRS256(true);
    }

    if (headers.alg === "HS256") {
      setHS256(true);
    }
  };

  const resetValues = () => {
    setDecodedHeader("");
    setDecodedPayload("");
    setRS256(false);
    setHS256(false);
  };

  const handleJWTChange = (event) => {
    event.preventDefault();
    resetValues();
    setJot(event.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    try {
      resetValues();
      decode(jot);
    } catch (e) {
      // Gets the reason for failure.
      console.error("e");
      console.error(e.message);
      const msg = e.message.split(". ")[1] || e.message;
      console.error(msg);
      setJotError(msg);
      setAnchorEl(event.target);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Error Message for Decode */}
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
        }}>
        <Typography sx={theme.errorMessage}>{jotError}</Typography>
      </Popover>
      <Container sx={theme.root}>
        <Paper
          xs={12}
          sx={theme.paper}>
          <Grid
            container
            width="100%"
            pt="1%">
            {/* Heading */}
            <JWTDecoderHeading />

            <form
              noValidate
              onSubmit={handleSubmit}
              style={{ width: "100%" }}>
              <Grid
                item
                xs={12}
                pb="2%">
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
                  maxRows={4}
                  multiline
                  onChange={handleJWTChange}
                  inputProps={{ spellCheck: "false" }}
                  sx={{
                    "& .MuiInputBase-root": {
                      padding: "3% 0 2% 2%",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: ".75rem",
                      lineHeight: ".85rem",
                      paddingBottom: "1%",
                    },
                    "& .MuiFormLabel-root": {
                      color: "#004a3f",
                      fontSize: "1.35rem",
                      fontWeight: "fontWeightBold",
                      lineHeight: "1.35rem",
                    },
                  }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                pb="3%">
                <DecodeButton />
              </Grid>
            </form>
            {/* Output */}
            <Grid
              item
              container
              xs={12}>
              <Grid
                item
                xs={12}
                pb="1%">
                <Typography>Header</Typography>
                <JSONOutput
                  id="Header"
                  json={decodedHeader}
                />
              </Grid>
              <Grid
                item
                xs={12}
                pb="1%">
                <Typography>Payload</Typography>
                <JSONOutput
                  id="Payload"
                  json={decodedPayload}
                />
              </Grid>
              <Grid
                item
                xs={12}
                pb="1%">
                <Typography>Signature</Typography>
                <TextField
                  variant="outlined"
                  margin="none"
                  disabled
                  fullWidth
                  id="signature"
                  name="Signature"
                  value={signature}
                  maxRows={2}
                  multiline
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: ".75rem",
                      lineHeight: ".85rem",
                    },
                  }}
                />
              </Grid>
              <Grid
                item
                container
                xs={12}>
                <SignatureVerification
                  jot={jot}
                  signature={signature}
                  rs256={rs256}
                  hs256={hs256}
                  decodedHeader={decodedHeader}
                  decodedPayload={decodedPayload}
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;
