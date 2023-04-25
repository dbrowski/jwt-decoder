import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import PendingIcon from "@mui/icons-material/Pending";
import Popover from "@mui/material/Popover";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import VerifySigBtn from "./LoadingButton";
import * as jose from "jose";
import * as rs from "jsrsasign";

const SignatureVerification = ({
  jot,
  signature,
  rs256,
  hs256,
  decodedHeader,
  decodedPayload,
}) => {
  const [rsaPubKeyFormat, setRSAPubKeyFormat] = useState("jwk");
  const [pem, setPEM] = useState("");
  const [jwk, setJWK] = useState("");
  const [jwksURL, setJWKSURL] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [verifiedSignature, setVerifiedSignature] = useState(false);
  const [n, setN] = useState("");
  const [e, setE] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [jotError, setJotError] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  useEffect(() => {
    resetValues();
  }, [rs256, hs256]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleValidateJWT = async (event) => {
    event.preventDefault();
    setVerifiedSignature(false);

    let verified = false;

    try {
      verified = verifySig(event);
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
      setAnchorEl(event.target);
    }

    return verified;
  };

  const resetValues = () => {
    setVerifiedSignature(false);
    setE("");
    setN("");
    setPEM("");
  };

  const handleRSAPubKeyFormatChange = (event) => {
    event.preventDefault();
    resetValues();
    setRSAPubKeyFormat(event.target.value);
  };

  const handleEChange = (event) => {
    event.preventDefault();
    setE(event.target.value);
  };

  const handleNChange = (event) => {
    event.preventDefault();
    setN(event.target.value);
  };

  const handlePEMChange = (event) => {
    event.preventDefault();
    setPEM(event.target.value);
  };

  const handlePassphraseChange = (event) => {
    event.preventDefault();
    setPassphrase(event.target.value);
  };

  const verifySig = async (event) => {
    const JWS = rs.jws.JWS;
    let isValid = false;

    if (!signature) {
      let msg =
        "Missing the JWT signature. Either this JWT does not contain a signature or it could not be decoded.";
      setJotError(msg);
      setAnchorEl(event.currentTarget);
      setVerifiedSignature(false);
      console.error(msg);
      return;
    }

    if (rs256) {
      if (rsaPubKeyFormat === "pem") {
        try {
          const rsaKey = rs.KEYUTIL.getKey(pem);
          isValid = JWS.verify(jot, rsaKey, ["RS256"]);
          setVerifiedSignature(isValid);
        } catch (e) {
          let msg = e.message;
          setJotError(msg);
          setAnchorEl(event.target);
          setVerifiedSignature(false);
          console.error(msg);
        }
      } else if (rsaPubKeyFormat === "jwk") {
        try {
          const rsaPublicKey = await jose.importJWK(
            {
              kty: "RSA",
              e: e,
              n: n,
            },
            "RS256"
          );
          const { _payload, _protectedHeader } = await jose.jwtVerify(
            jot,
            rsaPublicKey,
            {
              issuer: decodedPayload.iss,
              audience: decodedPayload.aud,
              clockTolerance: Number.POSITIVE_INFINITY,
            }
          );

          // if jwtVerify doesn't throw an exception, then the signature has
          // been successfully verified
          setVerifiedSignature(true);
        } catch (e) {
          let msg = e.message;
          setJotError(msg);
          setAnchorEl(event.target);
          setVerifiedSignature(false);
          console.error(msg);
        }
      } else {
        let msg =
          "Need a RSA public key jwk or certificate to verify the JWT signature.";
        setJotError(msg);
        setAnchorEl(event.target);
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
        setAnchorEl(event.target);
        setVerifiedSignature(false);
        console.error(msg);
      }
    } else {
      let msg = "Didn't recognize the algorithm. Use RS256 or HS256.";
      setJotError(msg);
      setAnchorEl(event.target);
      setVerifiedSignature(false);
      console.error(msg);
    }

    return isValid;
  };

  return (
    <ThemeProvider theme={theme}>
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
      <Grid
        id="sigComponentGridContainer"
        item
        container
        xs={12}>
        <Grid
          item
          xs={12}
          pt="2%">
          <Typography
            variant="subtitle2"
            fontSize="1rem">
            Signature Verification
          </Typography>
        </Grid>
        {decodedHeader && rs256 ? (
          <Grid
            item
            container
            xs={12}>
            <Grid
              item
              container
              xs={12}>
              <FormControl
                component={Grid}
                item
                container
                direction="row"
                xs={12}>
                <Grid
                  item
                  container
                  xs={5}
                  sm={3}
                  flexGrow={1}
                  alignContent="center">
                  <FormLabel id="rsa-pubKey-radio-btns-group-label">
                    <Typography color="primary">RSA Public Key</Typography>
                  </FormLabel>
                </Grid>
                <Grid
                  item
                  xs={7}
                  sm={9}
                  flexGrow={1}>
                  <RadioGroup
                    row
                    aria-labelledby="rsa-pubKey-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={rsaPubKeyFormat}
                    onChange={handleRSAPubKeyFormatChange}
                    sx={{
                      fontSize: ".5rem",
                      justifyContent: "flex-end",
                      alignContent: "center",
                    }}>
                    <FormControlLabel
                      value="jwk"
                      control={
                        <Radio
                          name="rsa-pubKey-format-radio-button-jwk"
                          size="small"
                        />
                      }
                      label="JWK"
                    />
                    <FormControlLabel
                      value="pem"
                      control={
                        <Radio
                          name="rsa-pubKey-format-radio-button-pem"
                          size="small"
                        />
                      }
                      label="PEM"
                    />
                  </RadioGroup>
                </Grid>
              </FormControl>
            </Grid>
            {rsaPubKeyFormat === "jwk" ? (
              <Grid
                item
                container
                xs={12}
                spacing={3}>
                <Grid
                  item
                  xs={12}>
                  <Typography>JWK</Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={2}>
                  <TextField
                    variant="outlined"
                    margin="none"
                    color={verifiedSignature ? "primary" : "secondary"}
                    required
                    fullWidth
                    id="kty"
                    label="kty"
                    name="kty"
                    value={rs256 ? "RSA" : ""}
                    maxRows={1}
                    multiline
                    sx={{
                      "& .MuiInputBase-formControl, label[data-shrink='false']":
                        {
                          fontSize: "0.8rem",
                          lineHeight: "0.85rem",
                        },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "0.75rem",
                        lineHeight: "0.8rem",
                      },
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={2}>
                  <TextField
                    variant="outlined"
                    margin="none"
                    color={verifiedSignature ? "primary" : "secondary"}
                    required
                    fullWidth
                    id="alg"
                    label="alg"
                    name="alg"
                    value={decodedHeader ? decodedHeader.alg : ""}
                    maxRows={1}
                    multiline
                    sx={{
                      "& .MuiInputBase-formControl, label[data-shrink='false']":
                        {
                          fontSize: "0.8rem",
                          lineHeight: "0.85rem",
                        },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "0.75rem",
                        lineHeight: "0.8rem",
                      },
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={6}
                  sm={8}>
                  <TextField
                    variant="outlined"
                    margin="none"
                    color={verifiedSignature ? "primary" : "secondary"}
                    required
                    fullWidth
                    id="e"
                    label="e"
                    name="e"
                    value={e}
                    maxRows={1}
                    multiline
                    onChange={handleEChange}
                    sx={{
                      "& .MuiInputBase-formControl, label[data-shrink='false']":
                        {
                          fontSize: "0.8rem",
                          lineHeight: "0.85rem",
                        },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "0.75rem",
                        lineHeight: "0.8rem",
                      },
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}>
                  <TextField
                    variant="outlined"
                    margin="none"
                    color={verifiedSignature ? "primary" : "secondary"}
                    required
                    fullWidth
                    id="n"
                    label="n"
                    name="n"
                    value={n}
                    maxRows={1}
                    multiline
                    onChange={handleNChange}
                    sx={{
                      "& .MuiInputBase-formControl, label[data-shrink='false']":
                        {
                          fontSize: "0.8rem",
                          lineHeight: "0.85rem",
                        },
                      "& .MuiOutlinedInput-input": {
                        fontSize: "0.75rem",
                        lineHeight: "0.8rem",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
            {rsaPubKeyFormat === "pem" ? (
              <Grid
                item
                container
                xs={12}>
                <Grid
                  item
                  xs={12}
                  pb="1%">
                  <Typography>PEM</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}>
                  <TextField
                    variant="outlined"
                    margin="none"
                    color={verifiedSignature ? "primary" : "secondary"}
                    required
                    fullWidth
                    id="pem"
                    label="PEM"
                    name="pem"
                    value={pem}
                    maxRows={3}
                    multiline
                    onChange={handlePEMChange}
                  />
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
        ) : (
          <></>
        )}
        {decodedHeader && hs256 ? (
          <Grid
            item
            xs={12}
            sx={{ flex: "10 0 auto", paddingBottom: "2%" }}>
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
              maxRows={4}
              multiline
              onChange={handlePassphraseChange}
            />
          </Grid>
        ) : (
          <></>
        )}
        {decodedHeader && decodedPayload ? (
          <Grid
            item
            container>
            <Grid
              item
              container
              pt="2%"
              pb="1%"
              xs={12}>
              <VerifySigBtn verifySignature={handleValidateJWT} />
            </Grid>
            <Grid
              item
              container
              xs={12}
              sx={{ flex: "1 0 auto", paddingBottom: "1%" }}>
              {verifiedSignature ? (
                <Grid
                  item
                  container
                  xs={12}>
                  <Grid item>
                    <Typography color="primary">Signature Verified</Typography>
                  </Grid>
                  <Grid
                    item
                    sx={{ paddingLeft: "1%" }}>
                    <CheckIcon color="primary" />
                  </Grid>
                </Grid>
              ) : (
                <Grid
                  item
                  container
                  xs={12}>
                  <Grid item>
                    <Typography
                      color="info"
                      fontWeight="fontWeightBold">
                      Signature not verified{" "}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    sx={{ paddingLeft: "1%" }}>
                    <PendingIcon color="info" />
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        ) : (
          <Grid
            item
            xs={12}
            pt="2%"
            pb="10%">
            <Typography
              color="error"
              fontSize=".65rem">
              First, decode a JWT, then you can verify its signature.
            </Typography>
          </Grid>
        )}
        {/* </form> */}
      </Grid>
    </ThemeProvider>
  );
};

export default SignatureVerification;
