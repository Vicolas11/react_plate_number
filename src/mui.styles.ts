import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  root: {
    "&$selected": {
      background: "#3b82f6",
    },
    "&:hover": {
      background: "#f3f4f6",
    },
  },
  selected: {},
});

export const useStylesCropBtn = makeStyles({
  root: {
    "&$contained": {
      background: "#3f51b5",
      "&:hover": {
        background: "#303f9f",
      },
      "&$disabled": {
        background: "#e0e0e0",
        cursor: "not-allowed",
      },
    },
  },
  contained: {},
  disabled: {},
});

export const toastStyle = {
  style: {
    background: "#1f2937",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    color: "white",
  },
};
