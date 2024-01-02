import React from 'react';
import { Link } from 'react-router-dom';
import Style from './MenuApp.module.scss';

export default function MenuApp() {
  return (
    <ul className={Style.list}>
      <li>
        <Link to="/topics">
          <h2 className={Style.title}>Форум</h2>
        </Link>
      </li>
    </ul>
  );
}
