import { ReactNode } from 'react';

import Style from './NavigationNotAuthUser.module.scss';

export default function NavigationNotAuthUser({
  children,
  text,
}: {
  children?: ReactNode;
  text: string;
}) {
  return (
    <div className={Style.conteiner}>
      <p className={Style.description}>{text}</p>
      {children}
    </div>
  );
}
