import { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

export default function VerifySigBtn(props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();
  const theme = useTheme();

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = async (event) => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      const verified = await props.verifySignature(event);
      timer.current = window.setTimeout(() => {
        if (verified) {
          setSuccess(true);
        } else {
          setSuccess(false);
        }
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <Grid
      item
      xs={12}>
      <Button
        fullWidth
        variant="outlined"
        disabled={loading}
        onClick={handleButtonClick}
        sx={{
          color: "#B3282D",
          borderColor: "#B3282D",
        }}>
        Verify Signature
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          className={theme.buttonProgress}
        />
      )}
    </Grid>
  );
}
