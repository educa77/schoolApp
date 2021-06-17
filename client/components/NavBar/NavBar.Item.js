import React, { useCallback, useMemo } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@material-ui/core";
import useStyles from "./NavBar.Item.styles";
import { useRouter } from "next/router";

function NavBarItem({ title, icon: Icon, to, exact, active }) {
  const classes = useStyles();
  const router = useRouter();

  const selected = useMemo(() => {
    if (!to) return false;
  }, [to, exact]);

  const handleClick = useCallback(() => {
    if (to) router.push(to);
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
