import React from 'react';

import Style from './Home.module.scss';

import { useSelector } from 'react-redux';
import { selectAuth, resetForm } from '../../redax/slices/authSlice';

import Header from '../Header/Header';
import Authorization from '../Authorization/Authorization';
import AuthorizedUser from '../AuthorizedUser/AuthorizedUser';
import MenuApp from './MenuApp/MenuApp';
import Footer from '../Footer/Footer';
import { useAppDispatch } from '../../redax/store';

export default function Home() {
  const dispatch = useAppDispatch();
  const { token, fopmReg, fopmSign } = useSelector(selectAuth);

  React.useEffect(() => {
    function closeByEscape(evt: KeyboardEvent | React.KeyboardEvent): void {
      if (evt.key === 'Escape') {
        dispatch(resetForm());
      }
    }
    if (fopmReg || fopmSign) {
      // навешиваем только при открытии
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      };
    }
  }, [fopmReg, fopmSign]);

  return (
    <div className={Style.page}>
      <header className="">
        <Header />
      </header>
      <main>
        <section>{token ? <AuthorizedUser /> : <Authorization />}</section>
        <section>
          <MenuApp />
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
