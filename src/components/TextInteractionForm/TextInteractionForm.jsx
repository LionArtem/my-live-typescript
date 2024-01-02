import React from 'react';
import Style from './TextInteractionForm.module.scss';

export default function TextInteractionForm({ text, request }) {
  return (
    <span className={`${Style.error} ${request && Style.success} `}>
      {text}
    </span>
  );
}
