import React from 'react';
import Style from './EmptyPage.module.scss';

export default function EmptyPage({ text }) {
  return <p className={Style.emptyPage}>{text}</p>;
}
