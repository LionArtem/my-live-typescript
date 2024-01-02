import React from 'react';
import Style from './ModulContainer.module.scss';

export default function ModulContainer({ clickOverly, children }) {
  return (
    <div
      onClick={(evt) => {
        if (evt.target === evt.currentTarget && clickOverly) {
          clickOverly();
        }
      }}
      className={Style.overflow}
    >
      {children}
    </div>
  );
}
