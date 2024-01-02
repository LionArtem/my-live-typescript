import React from 'react';
import Style from './ButtonDelete.module.scss';

export default function ButtonDelete({ text, onClick, id }) {
  return (
    <div onClick={() => onClick(id)} className={Style.buttonDelete}>
      {text}
    </div>
  );
}
