import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import theme from "./theme";

const JWTDecoderHeading = () => {
  return (
    <Grid
      id="jwtDecoderHeading"
      item
      container
      xs={12}>
      <Grid
        item
        container
        justifyContent="center"
        xs={12}>
        <Avatar sx={theme.avatar}>
          <LockOpenIcon />
        </Avatar>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ textAlign: "center", paddingBottom: "1%" }}>
        <Typography
          component="h1"
          variant="poster">
          JWT Decoder
        </Typography>
      </Grid>
    </Grid>
  );
};

export default JWTDecoderHeading;
