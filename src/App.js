import React, { useState, lazy, Suspense } from "react";
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

import { importMDX } from "mdx.macro";

// const Content = lazy(() => importMDX("./InfoText.mdx"));

const useStyles = makeStyles(theme => ({
  root: {
    maxHeight: "100vw"
  },
  image: {
    backgroundImage:
      "url(https://pingidentity.com/content/dam/ping-6-2-assets/open-graph-images/2019/P14C-Build-OG.png)",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#576877",
    backgroundSize: "cover",
    backgroundPosition: "center",
    maxHeight: "20vw"
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    height: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    color: "#2E4355"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#2E4355"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(10)
  },
  submit: {
    backgroundColor: "#2E4355",
    margin: theme.spacing(3, 0, 2)
  },
  typography: {
    color: "#2E4355",
    fontSize: "1rem"
  },
  errorMessage: {
    color: "red"
  },
  infoPaperContainer: {
    maxHeight: "100%",
    overflow: "auto"
  },
  info: {
    height: "100%",
    maxHeight: "100%",
    color: "#2E4355",
    margin: "0",
    padding: "0"
  }
}));

export default function App() {
  // Use the above styles.
  const classes = useStyles();

  // State variables and setters.
  const [jot, setJot] = useState("");
  const [decodedJot, setDecodedJot] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [jotError, setJotError] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  const handleSubmit = event => {
    event.preventDefault();

    try {
      decode();
    } catch (e) {
      // Gets the reason for failure.
      let msg = e.message.split(". ")[1];
      console.error(msg);
      setJotError(msg);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleJWTChange = event => {
    event.preventDefault();
    setJot(event.target.value);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const decode = () => {
    let dj = jwtDecoder.jwtDecode(jot);
    setDecodedJot(dj);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      {/* <Grid
        container
        item
        xs={5}
        direction="column"
        style={{
          overflow: "auto"
        }}
      >
        <Grid
          item
          spacing={0}
          className={classes.image}
          style={{ maxHeight: "20vw", flex: "0 2 auto" }}
        ></Grid>
        <Grid
          item
          spacing={0}
          style={{
            paddingLeft: "15%",
            paddingRight: "15%",
            margin: "0",
            flex: "2 1 auto"
          }}
        >
          <Suspense fallback={<div>Loading...</div>} id="suspense">
            <Content id="content" />
          </Suspense>
        </Grid>
      </Grid> */}

      <Grid
        item
        container
        xs={12}
        component={Paper}
        elevation={6}
        square
        style={{ height: "100%" }}
      >
        <Grid item container className={classes.paper} direction="column">
          <Grid
            item
            container
            xs={12}
            justify="center"
            style={{
              flex: "0 1 0"
            }}
          >
            <Avatar className={classes.avatar}>
              <LockOpenIcon />
            </Avatar>
          </Grid>
          <Grid item xs={12} style={{ flex: "0 1 0" }}>
            <Typography component="h3" variant="h3" align="center">
              JWT Decoder
            </Typography>
          </Grid>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <Grid
              item
              container
              direction="column"
              justify="flex-between"
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
                    horizontal: "center"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
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
                      paddingTop="0"
                      marginTop="0"
                      style={{
                        margin: 0,
                        padding: 0,
                        fontSize: "1rem"
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
                  marginBottom="0rem"
                >
                  {decodedJot ? (
                    <JSONPretty
                      id="pretty-payload"
                      data={decodedJot.payload}
                      theme={JSONPrettyMon}
                      style={{
                        margin: 0,
                        padding: 0,
                        fontSize: "1rem"
                      }}
                      mainStyle="padding: 0, margin: 0"
                      valueStyle="padding: 0, margin: 0"
                    />
                  ) : (
                    ""
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
