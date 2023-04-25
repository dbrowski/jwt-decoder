import Box from "@mui/material/Box";
import JSONPretty from "react-json-pretty";
import * as JSONPrettyMon from "react-json-pretty/themes/monikai.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

const JSONOutput = ({ id, json }) => {
  const showJSON = (json) => {
    if (json) {
      return (
        <JSONPretty
          id={"jsonPretty" + id}
          className="jsonPretty"
          data={json}
          theme={JSONPrettyMon}
          mainStyle="padding: 1%; margin: 0; border: 1; border-radius: 5;"
          keyStyle="color: #F2C0BA; font-size: .9rem; font-weight: bold;"
          valueStyle="color: #B3CEF5; font-size: 1rem; padding: 0; margin: 0"
          stringStyle="color: #04F06A; font-size: 1rem;"
          booleanStyle="font-size: 1rem;"
        />
      );
    }

    return <Box sx={{ backgroundColor: "transparent", padding: "1%" }}></Box>;
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        id={"jsonPrettyBoxContainer" + id}
        className="jsonPrettyBoxContainer"
        backgroundColor="#1e1e1e"
        border={10}
        borderRadius={5}
        borderColor="#1e1e1e"
        marginTop={0}
        marginBottom={0}>
        {showJSON(json)}
      </Box>
    </ThemeProvider>
  );
};

export default JSONOutput;
