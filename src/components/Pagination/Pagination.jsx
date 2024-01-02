import React from 'react';
import Style from './Pagination.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectPagination,
  pointNumberPagination,
} from '../../redax/slices/paginationSlice';

export default function Pagination({ getNumberPage, numberPages }) {
  const dispatch = useDispatch();
  const { paginationNumber } = useSelector(selectPagination);

  React.useEffect(() => {
    return () => dispatch(pointNumberPagination(1));
  }, []);

  return (
    <nav>
      <ul className={Style.list}>
        {numberPages.map((res, i) => (
          <li
            className={paginationNumber === i + 1 ? Style.active : ''}
            key={i}
            onClick={() => {
              dispatch(pointNumberPagination(i + 1));
              getNumberPage(i + 1);
              localStorage.setItem('page', i + 1);
            }}
          >
            {i + 1}
          </li>
        ))}
      </ul>
    </nav>
  );
}
