import { createGlobalStyle, css } from "styled-components";

import { colors, device } from "./Theme";

export const GlobalStyle = createGlobalStyle`

html {
    width: 100%;
    height: 100%; 
}
body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-family: "Montserrat";
    font-size: 16px;
    font-weight: 300;
    color: ${colors.black};
}
strong, 
.--strong {
    font-weight: 500;
}
sup {
    vertical-align: super;
    font-size: 8px;
}
button, a{
    cursor: pointer; 
}
#primary-search-account-menu {
  margin-top: 52px;
}
.closeButton {
   width: 1.5rem;
   height: 1.5rem;
   border-radius: 15%;
   border-style: none;
   background: #f8e4ab;
   font-size: 0.9rem;
   right: 0.5rem;
   top: 0.5rem;
   cursor: pointer;
   position: absolute;
   padding-bottom: 4px;
   box-shadow: 0.3px 0.3px 0.6px rgb(0, 0, 0);
   color: rgb(22, 22, 22);
   z-index: 1;
}

.sidebar {
   position: fixed;
   z-index: 1;
   transform: translateX(-17.5rem);
   width: 17rem;
   background: #f5f5f5;
   height: 100%;
   transition: all 0.5s;
   margin-top: 64px;
   box-shadow: 3px 1.5px 3px rgb(161, 161, 161);
   z-index: 1;
}
.sidebar.open {
   transform: translateX(0);
}
`;
