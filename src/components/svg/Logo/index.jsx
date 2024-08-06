import React from "react";

function Logo(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      version="1.1"
      viewBox="0 0 310.9 75"
    >
      <rect
        width="75"
        height="75"
        x="235.9"
        y="0"
        fill="#ff4577"
        rx="13"
      ></rect>
      <path
        fill={props.dark ? "#FFF" : "#000"}
        d="M12.74 23.2H0v-8.82h35.56v8.82h-12.6V61H12.74zm30.405-8.82h10.15V61h-10.15zM85.41 61.91c-7.467 0-13.3-2.007-17.5-6.02-4.2-4.013-6.3-9.683-6.3-17.01 0-4.993.98-9.403 2.94-13.23 2.006-3.827 4.83-6.767 8.47-8.82 3.64-2.1 7.84-3.15 12.6-3.15 3.873 0 7.607.7 11.2 2.1l-1.89 9.03c-3.173-1.447-6.253-2.17-9.24-2.17-4.247 0-7.607 1.4-10.08 4.2-2.474 2.753-3.71 6.44-3.71 11.06 0 4.713 1.306 8.377 3.92 10.99 2.613 2.613 6.23 3.92 10.85 3.92 3.033 0 5.973-.49 8.82-1.47l1.54 8.61c-3.407 1.307-7.28 1.96-11.62 1.96zm19.792-47.53h10.15v18.06l15.19-18.06h12.11l-19.18 22.12 18.2 24.5h-12.32l-14-18.83V61h-10.15zm43.067 0h28.35v8.82h-18.34v9.31h15.19v8.54h-15.19v11.13h18.34V61h-28.35zm47.742 8.82h-12.74v-8.82h35.56v8.82h-12.6V61h-10.22zm28.297 40.18c-1.96 0-3.663-.723-5.11-2.17-1.4-1.4-2.1-3.08-2.1-5.04 0-2.007.7-3.71 2.1-5.11 1.447-1.447 3.15-2.17 5.11-2.17 2.007 0 3.71.723 5.11 2.17 1.4 1.4 2.1 3.103 2.1 5.11 0 1.96-.7 3.64-2.1 5.04-1.4 1.447-3.103 2.17-5.11 2.17z"
      ></path>
      <path
        fill="#fff"
        d="M241.524 14.38h10.15V61h-10.15zm41.565 47.53c-4.574 0-8.61-1.003-12.11-3.01-3.5-2.007-6.23-4.83-8.19-8.47-1.914-3.64-2.87-7.817-2.87-12.53 0-4.76.956-8.96 2.87-12.6 1.913-3.64 4.62-6.463 8.12-8.47 3.5-2.007 7.56-3.01 12.18-3.01 4.573 0 8.61 1.003 12.11 3.01 3.5 1.96 6.206 4.737 8.12 8.33 1.913 3.593 2.87 7.747 2.87 12.46 0 4.807-.957 9.053-2.87 12.74-1.914 3.64-4.62 6.487-8.12 8.54-3.5 2.007-7.537 3.01-12.11 3.01zm0-8.89c3.826 0 6.883-1.377 9.17-4.13 2.333-2.753 3.5-6.417 3.5-10.99 0-2.987-.537-5.623-1.61-7.91-1.027-2.333-2.52-4.107-4.48-5.32-1.914-1.26-4.107-1.89-6.58-1.89-2.474 0-4.69.63-6.65 1.89-1.914 1.213-3.407 2.987-4.48 5.32-1.027 2.287-1.54 4.923-1.54 7.91s.513 5.623 1.54 7.91c1.073 2.287 2.566 4.06 4.48 5.32 1.913 1.26 4.13 1.89 6.65 1.89z"
      ></path>
    </svg>
  );
}

export default Logo;