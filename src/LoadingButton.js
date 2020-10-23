import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import SaveIcon from "@material-ui/icons/Save";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  wrapper: {
    margin: theme.spacing(0),
    position: "relative",
    maxWidth: "100%",
    width: "100%",
  },
  buttonSuccess: {
    color: "#ffffff",
    backgroundColor: "#2E4355",
    "&:hover": {
      backgroundColor: "#2E2240",
    },
  },
  fabProgress: {
    color: "#2E4355",
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: "#2E4355",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function CircularIntegration(props) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  React.useEffect(() => {
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
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          className={buttonClassname}
          disabled={loading}
          onClick={handleButtonClick}
        >
          Verify Signature
        </Button>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </div>
  );
}
