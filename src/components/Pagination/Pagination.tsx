import React from 'react';
import Style from './Pagination.module.scss';
import { useSelector } from 'react-redux';
import {
  selectPagination,
  pointNumberPagination,
} from '../../redax/slices/paginationSlice';
import { useAppDispatch } from '../../redax/store';

type PaginationProps = {
  getNumberPage: (page: number) => void;
  numberPages: number[];
};

export default function Pagination({
  getNumberPage,
  numberPages,
}: PaginationProps) {
  const dispatch = useAppDispatch();
  const { paginationNumber } = useSelector(selectPagination);

  React.useEffect((): (() => void) => {
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
              localStorage.setItem('page', String(i + 1));
            }}
          >
            {i + 1}
          </li>
        ))}
      </ul>
    </nav>
  );
}
