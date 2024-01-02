import React from "react";
import Style from "./ModuleBigFoto.module.scss";
import ModulContainer from "../ModulContainer/ModulContainer";
import { URL_SERVER } from "../../../utils/Constants";

export default function ModuleBigFoto({ isShowBigAvatar, url }) {
  return (
    <ModulContainer clickOverly={isShowBigAvatar}>
      <img
        className={Style.bigAvatar}
        src={`${URL_SERVER}/${url}`}
        alt="аватар"
      />
    </ModulContainer>
  );
}
