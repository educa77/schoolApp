import { Button } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

export const StyledTableCell = withStyles((theme) => ({
  head: {
    fontFamily: "Trebuchet MS",
    height: "2rem",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export const StyledTableRow = withStyles((theme) => ({
  root: {
    // "&:nth-of-type(odd)": {
    //    backgroundColor: theme.palette.action.hover,
    // },
  },
}))(TableRow);

export const useStyles = makeStyles({
  table: {
    //height: 'calc(100vh - 4rem - 1px)'
  },
  botones: {
    display: "flex",
    justifyContent: "flex-end",
  },
});
