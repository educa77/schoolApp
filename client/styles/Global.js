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
.wmde-markdown {
  font-size: 16px;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
}
.wmde-markdown > :first-child {
  margin-top: 0 !important;
}
.wmde-markdown > :last-child {
  margin-bottom: 0 !important;
}
.wmde-markdown code[class*="language-"],
.wmde-markdown pre[class*="language-"] {
  color: black;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  -webkit-hyphens: none;
          hyphens: none;
}
.wmde-markdown pre code {
  background: none;
  overflow-wrap: normal;
  white-space: inherit;
  -moz-tab-size: 2;
       tab-size: 2;
  padding: 16px;
  font-size: 95%;
  line-height: 1.5;
  display: block;
  text-shadow: 0 1px #fff;
}
.wmde-markdown pre {
  margin-bottom: 18px;
  font-size: 85%;
  line-height: 1.45;
  position: relative;
  overflow-x: auto;
  background-color: #f6f8fa;
  border-radius: 3px;
}
.wmde-markdown code,
.wmde-markdown tt {
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-size: 85%;
  margin: 0;
  padding: 0.2em 0.4em;
}
.wmde-markdown pre,
.wmde-markdown code,
.wmde-markdown tt {
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
}
.wmde-markdown img {
  max-width: 100%;
}
.wmde-markdown input {
  vertical-align: middle;
  margin: 0 0.2em 0.25em -1.6em;
}
.wmde-markdown input + p {
  display: inline;
}
.wmde-markdown h1,
.wmde-markdown h2 {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}
.wmde-markdown h1,
.wmde-markdown h2,
.wmde-markdown h3,
.wmde-markdown h4,
.wmde-markdown h5,
.wmde-markdown h6 {
  font-weight: 600;
  line-height: 1.25;
  margin-bottom: 16px;
  margin-top: 24px;
}
.wmde-markdown h1 .anchor,
.wmde-markdown h2 .anchor,
.wmde-markdown h3 .anchor,
.wmde-markdown h4 .anchor,
.wmde-markdown h5 .anchor,
.wmde-markdown h6 .anchor {
  float: left;
  padding-right: 4px;
  margin-left: -20px;
  line-height: 1;
}
.wmde-markdown h1 .octicon-link,
.wmde-markdown h2 .octicon-link,
.wmde-markdown h3 .octicon-link,
.wmde-markdown h4 .octicon-link,
.wmde-markdown h5 .octicon-link,
.wmde-markdown h6 .octicon-link {
  visibility: hidden;
  vertical-align: middle;
}
.wmde-markdown h1:hover .octicon-link,
.wmde-markdown h2:hover .octicon-link,
.wmde-markdown h3:hover .octicon-link,
.wmde-markdown h4:hover .octicon-link,
.wmde-markdown h5:hover .octicon-link,
.wmde-markdown h6:hover .octicon-link {
  visibility: visible;
}
.wmde-markdown h1 {
  font-size: 2em;
}
.wmde-markdown h2 {
  font-size: 1.5em;
}
.wmde-markdown h3 {
  font-size: 1.25em;
}
.wmde-markdown h4 {
  font-size: 1em;
}
.wmde-markdown h5 {
  font-size: 0.875em;
}
.wmde-markdown h6 {
  font-size: 0.85em;
}
.wmde-markdown ol,
.wmde-markdown ul {
  padding-left: 2em;
}
.wmde-markdown ol > p,
.wmde-markdown ul > p {
  margin-bottom: 0;
}
.wmde-markdown ul {
  margin-bottom: 16px;
  margin-top: 0;
  list-style: initial;
}
.wmde-markdown > blockquote,
.wmde-markdown > blockquote blockquote {
  margin: 0;
  border-left: 0.25em solid #dfe2e5;
  color: #6a737d;
  padding: 0 1em;
}
.wmde-markdown > blockquote > :last-child,
.wmde-markdown > blockquote blockquote > :last-child {
  margin-bottom: 0;
}
.wmde-markdown > blockquote > :first-child,
.wmde-markdown > blockquote blockquote > :first-child {
  margin-top: 0;
}
.wmde-markdown hr {
  margin: 1.5em auto;
  border: 0;
  border-top: 2px dotted #eee;
  height: 1px;
}
.wmde-markdown > table,
.wmde-markdown > blockquote table {
  display: block;
  overflow: auto;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 14px;
}
.wmde-markdown > table tr,
.wmde-markdown > blockquote table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}
.wmde-markdown > table td,
.wmde-markdown > blockquote table td,
.wmde-markdown > table th,
.wmde-markdown > blockquote table th {
  border: 1px solid #dfe2e5;
  padding: 6px 13px;
}
.wmde-markdown blockquote,
.wmde-markdown details,
.wmde-markdown dl,
.wmde-markdown ol,
.wmde-markdown p,
.wmde-markdown pre,
.wmde-markdown table,
.wmde-markdown ul {
  margin-bottom: 16px;
  margin-top: 0;
}
.wmde-markdown a {
  color: #0366d6;
  text-decoration: none;
}
.wmde-markdown a:hover {
  text-decoration: underline;
}
.wmde-markdown .namespace {
  opacity: 0.7;
}
.wmde-markdown .token.important {
  font-weight: normal;
}
.wmde-markdown .token.bold {
  font-weight: bold;
}
.wmde-markdown .token.italic {
  font-style: italic;
}
.wmde-markdown .token.entity {
  cursor: help;
}
.wmde-markdown-color .token.tag .attr-value {
  color: #032f62;
}
.wmde-markdown-color .token.property,
.wmde-markdown-color .token.tag,
.wmde-markdown-color .token.boolean,
.wmde-markdown-color .token.number,
.wmde-markdown-color .token.function-name,
.wmde-markdown-color .token.constant,
.wmde-markdown-color .token.symbol,
.wmde-markdown-color .token.deleted {
  color: #0060c9;
}
.wmde-markdown-color .token.punctuation {
  color: #a0a0a0;
}
.wmde-markdown-color code[class*="language-"] {
  color: black;
}
.wmde-markdown-color code[class*="language-"] .token.selector,
.wmde-markdown-color code[class*="language-"] .token.attr-name,
.wmde-markdown-color code[class*="language-"] .token.string,
.wmde-markdown-color code[class*="language-"] .token.char,
.wmde-markdown-color code[class*="language-"] .token.function,
.wmde-markdown-color code[class*="language-"] .token.builtin {
  color: #6f42c1;
}
.wmde-markdown-color code[class*="language-"] .token.inserted {
  color: #22863a;
  background-color: #f0fff4;
}
.wmde-markdown-color code[class*="language-"] .token.deleted {
  color: #b31d28;
  background-color: #ffeef0;
}
.wmde-markdown-color code[class*="language-"] .token.class-name {
  color: #6f42c1;
}
.wmde-markdown-color code[class*="language-"] .code-block {
  color: #032f62;
}
.wmde-markdown-color code[class*="language-"] .token.comment,
.wmde-markdown-color code[class*="language-"] .token.block-comment,
.wmde-markdown-color code[class*="language-"] .token.prolog,
.wmde-markdown-color code[class*="language-"] .token.doctype,
.wmde-markdown-color code[class*="language-"] .token.cdata {
  color: #7D8B99;
}
.wmde-markdown-color code[class*="language-"] .token.punctuation {
  color: #a0a0a0;
}
.wmde-markdown-color code[class*="language-"] .token.operator,
.wmde-markdown-color code[class*="language-"] .token.entity,
.wmde-markdown-color code[class*="language-"] .token.url,
.wmde-markdown-color code[class*="language-"] .token.variable {
  color: #d73a49;
  background: rgba(255, 255, 255, 0.5);
}
.wmde-markdown-color code[class*="language-"] .token.atrule,
.wmde-markdown-color code[class*="language-"] .token.attr-value {
  color: #004698;
}
.wmde-markdown-color code[class*="language-"] .token.keyword {
  color: #d63200;
}
.wmde-markdown-color code[class*="language-"] .token.regex,
.wmde-markdown-color code[class*="language-"] .token.important {
  color: #e90;
}
.wmde-markdown-color code[class*="language-"] .token.string {
  color: #0a53c1;
}
.w-md-editor-bar {
  position: absolute;
  cursor: s-resize;
  right: 0;
  margin-top: -11px;
  margin-right: 0;
  width: 14px;
  z-index: 3;
  height: 10px;
  border-radius: 0 0 3px 0;
  -webkit-user-select: none;
          user-select: none;
}
.w-md-editor-bar svg {
  display: block;
  margin: 0 auto;
}

`;
