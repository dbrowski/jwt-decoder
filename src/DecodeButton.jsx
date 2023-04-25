import Button from "@mui/material/Button";

const DecodeButton = () => {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      sx={{
        "fontSize": "1rem",
        "fontWeight": "fontWeightBold",
        "backgroundColor": "#B3282D",
        "&:hover, &.Mui-focusVisible": {
          backgroundColor: "#051727",
        },
      }}>
      Decode
    </Button>
  );
};

export default DecodeButton;
