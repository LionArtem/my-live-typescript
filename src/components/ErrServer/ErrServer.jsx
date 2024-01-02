import React from 'react';
import Style from './ErrServer.module.scss';

export default function ErrServer({ textErr }) {
  return (
    <div className={Style.conteiner}>
      <h2>{textErr}</h2>
    </div>
  );
}
