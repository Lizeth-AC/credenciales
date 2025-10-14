import React from "react";
import A4Page from "../atoms/A4Page";
import CredentialSheet from "../organisms/CredencialSheet";

const CredentialPageGroup = ({ pages, cargos, accesoComputo }) => {
  return (
    <>
      {pages.map((grupo, idx) => (
        <React.Fragment key={idx}>
          <A4Page forPrint>
            <CredentialSheet
              persons={grupo}
              side="anverso"
              cargos={cargos}
              accesoComputo={accesoComputo}
            />
          </A4Page>
          <A4Page forPrint>
            <CredentialSheet
              persons={grupo}
              side="reverso"
              cargos={cargos}
              accesoComputo={accesoComputo}
            />
          </A4Page>
        </React.Fragment>
      ))}
    </>
  );
};

export default CredentialPageGroup;