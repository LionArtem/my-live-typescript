import { useNavigate } from 'react-router-dom';

import Style from './ButtonsNavigation.module.scss';

export default function ButtonsNavigation({
  page,
  text,
}: {
  page: string;
  text: string;
}) {
  const navigate = useNavigate();
  return (
    <p onClick={() => navigate(page)} className={Style.button}>
      {text}
    </p>
  );
}
