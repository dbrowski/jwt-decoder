import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  root: {
    maxHeight: "100%",
  },
  paper: {
    display: "flex",
    height: "100%",
    maxWidth: "100%",
    paddingLeft: "2%",
    paddingRight: "2%",
    paddingTop: "2%",
    paddingBottom: "2%",
    alignItems: "stretch",
    color: "#B3282D",
  },
  avatar: {
    backgroundColor: "#B3282D",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: 0,
  },
  submit: {
    backgroundColor: "#B3282D",
  },
  errorMessage: {
    color: "#505D68",
    padding: "10%",
  },
  infoPaperContainer: {
    maxHeight: "100%",
    overflow: "auto",
  },
  palette: {
    info: {
      main: "#051727",
    },
    primary: {
      main: "#B3282D",
    },
    secondary: {
      main: "#28B3AE",
    },
    error: {
      main: "#505D68",
    },
    borderPalette: {
      main: "rgba(5, 23, 39, 0.25)",
    },
  },
  spacing: 2,
});

export default theme;
