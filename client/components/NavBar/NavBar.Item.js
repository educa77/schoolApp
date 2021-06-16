import React, { useCallback, useMemo } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@material-ui/core";
import { useHistory, useRouteMatch } from "react-router-dom";
import useStyles from "./NavBar.Item.styles";

function NavBarItem({ title, icon: Icon, to, exact }) {
  //console.log(title, Icon, to, exact, "navbar item");
  const classes = useStyles();
  /*  const match = useRouteMatch(to); */
  //const match = false
  const history = useHistory();
  const selected = useMemo(() => {
    if (!to) return false;
    /*     else if (match && exact) return match.isExact;
    else if (match) return true; */
    return false;
  }, [to, exact /* match */]);
  const handleClick = useCallback(() => {
    if (to) history.push(to);
  }, [to]);
  return (
    <ListItem
      className={classes.listItem}
      button
      selected={selected}
      onClick={handleClick}
    >
      <ListItemIcon>
        <Tooltip title={title} placement="right">
          <Icon />
        </Tooltip>
      </ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>
  );
}

export default NavBarItem;
