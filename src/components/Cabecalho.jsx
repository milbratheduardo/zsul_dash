import React from "react";
import {Helmet} from "react-helmet";

const Cabecalho = () => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>ZSUL</title>
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"></meta>
    </Helmet>
  );
};

export default Cabecalho;
