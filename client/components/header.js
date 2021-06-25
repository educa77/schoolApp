import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import Link from "next/link";
import useStyles from "./useStyles";
import { Avatar } from "@material-ui/core";
import styled from "styled-components";
import { useRouter } from "next/router";
import NavBar from "./NavBar/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../dispatchers/auth";

export default function Header({ handleShowMenu, currentView }) {
    const dispatch = useDispatch();
    const router = useRouter();

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const [show, setShow] = useState(false);

    const user = useSelector((state) => state.auth);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const menuId = "primary-search-account-menu";
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMenuOpen}
            onClose={handleMenuClose}>
            <UserMenu>
                <img alt="userImg" src={user?.photoUrl || "/Imagenes/user.png"}></img>
                <UserName>
                    {user?.givenName && capitalizeFirstLetter(user?.givenName)}{" "}
                    {user?.familyName && capitalizeFirstLetter(user?.familyName)}
                </UserName>
                <PerfilButton onClick={() => router.push("/profile/user")}>Perfil</PerfilButton>
                <LogoutBtn onClick={() => dispatch(signOut())}>Cerrar sesión</LogoutBtn>
            </UserMenu>
        </Menu>
    );

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit">
                    <Avatar src={user.photoUrl || "/Imagenes/user.png"} />
                </IconButton>
                <p>Perfil</p>
            </MenuItem>
        </Menu>
    );

    return (
        <div className={classes.grow}>
            <AppBar position="static" className={classes.header}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => handleShowMenu()}>
                        <MenuIcon />
                    </IconButton>
                    {/*          <Link href="/">
            <img alt="logoHenry" src="/Imagenes/user.png" />
          </Link> */}
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit">
                            <Avatar src={user.photoUrl || "/Imagenes/user.png"} />
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit">
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <NavBar show={show} view={currentView} />
            {renderMobileMenu}
            {renderMenu}
        </div>
    );
}

const UserMenu = styled.div`
    width: 300px;
    height: 250px;
    display: flex;
    align-items: center;
    flex-direction: column;
    img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        box-shadow: 0.3px 0.3px 1px 1px grey;
        margin-top: 20px;
    }
`;

const UserName = styled.p`
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial,
        sans-serif;
    margin-top: 10px;
`;

const PerfilButton = styled.button`
    width: 50%;
    height: 16%;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial,
        sans-serif;
    border-style: none;
    color: #444444;
    box-shadow: 0.3px 0.3px 1px grey;
    background: yellow;
    border-radius: 5px;
    margin-top: 10px;
    cursor: pointer;
    font-size: 100%;
    &:hover {
        box-shadow: 0.3px 0.3px 2px grey;
    }
`;

const LogoutBtn = styled.button`
    width: 51%;
    height: 17%;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial,
        sans-serif;
    color: white;
    border-style: solid;
    border-color: yellow;
    border-width: 0.6px;
    background: #444444;
    border-radius: 5px;
    margin-top: 10px;
    cursor: pointer;
    font-size: 100%;
    &:hover {
        border-style: none;
    }
`;

Header.renderData = {
    authRequired: true,
    header: true,
};
