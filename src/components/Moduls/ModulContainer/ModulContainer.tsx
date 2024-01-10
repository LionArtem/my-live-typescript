import { ReactNode } from 'react';
import Style from './ModulContainer.module.scss';

type ModulContainerProps = {
  clickOverly?: () => void;
  children: ReactNode;
};

export default function ModulContainer({
  clickOverly,
  children,
}: ModulContainerProps) {
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
