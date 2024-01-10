import React from 'react';
import Style from './ModuleBigFoto.module.scss';
import ModulContainer from '../ModulContainer/ModulContainer';
import { URL_SERVER } from '../../../utils/Constants';

type ModuleBigFotoProps = {
  isShowBigAvatar: () => void;
  url: string;
};

export default function ModuleBigFoto({
  isShowBigAvatar,
  url,
}: ModuleBigFotoProps) {
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
