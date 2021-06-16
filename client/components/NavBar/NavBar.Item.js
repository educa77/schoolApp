import React, { useCallback, useMemo } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@material-ui/core";
import useStyles from "./NavBar.Item.styles";
import Router from "next/router";

function NavBarItem({ title, icon: Icon, to, exact, active }) {
  const classes = useStyles();

  const selected = useMemo(() => {
    if (!to) return false;
  }, [to, exact /* match */]);
  const handleClick = useCallback(() => {
    if (to) Router.push(to);
  }, [to]);
  return (
    <ListItem
      className={classes.listItem}
      button
      selected={selected}
      onClick={handleClick}
      selected={active ? active : false}
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
