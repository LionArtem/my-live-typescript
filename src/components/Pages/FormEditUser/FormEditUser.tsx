import React, { useRef, useState } from 'react';

import Style from './FormEditUser.module.scss';
import { useSelector } from 'react-redux';

import {
  setValid,
  setValue,
  selectformValidetion,
  defaultValues,
  killAllStateFormValidetion,
  FormValidetionValue,
} from '../../../redax/slices/formValidetionSlice';

import {
  fetchGetUser,
  fetchPatchUser,
  selectUser,
  addTextSuccess,
  setSuccessRequest,
  User,
} from '../../../redax/slices/userSlice';
import FormEditUserPreloader from './FormEditUserPreloader';
import ButtonsNavigation from '../../Buttons/ButtonsNavigation/ButtonsNavigation';
import ButtonSubmit from '../../Buttons/ButtonSubmit/ButtonSubmit';
import TextInteractionForm from '../../TextInteractionForm/TextInteractionForm';
import { selectAuth } from '../../../redax/slices/authSlice';
import ErrServer from '../../ErrServer/ErrServer';
import { AllTown, allTown } from '../../../utils/AllTown';
import UserAvatarEdit from '../../UserAvatarEdit/UserAvatarEdit';
import { useAppDispatch } from '../../../redax/store';

export default function FormEditUser() {
  const townRef = useRef<HTMLDivElement>(null);
  const sityRef = useRef<HTMLUListElement>(null);
  const dispatch = useAppDispatch();
  const { value, errors, valid } = useSelector(selectformValidetion);
  const {
    user,
    showPreloader,
    textAnswerRequest,
    successRequest,
    showSceletonPage,
    errServer,
  } = useSelector(selectUser);
  const { token } = useSelector(selectAuth);
  const [listTown, isListTown] = useState(false);
  const [showCities, setShowCities] = useState<AllTown[]>();
  const [town, setTown] = useState('');
  const [citiesTop, isCitiesTop] = useState(0);

  const catList = (list: AllTown[], num: number) => {
    setShowCities(list.slice(0, num));
  };

  const addSityInList = (
    evt: React.UIEvent<HTMLUListElement>,
    arr: AllTown[]
  ) => {
    const allHeight = Math.floor((evt.target as HTMLUListElement).scrollHeight);
    const startDocument = Math.floor(
      (evt.target as HTMLUListElement).scrollTop
    );

    if (
      allHeight - startDocument <=
      (evt.target as HTMLUListElement).offsetHeight
    ) {
      catList(allTown, arr.length + 10);
    }
  };

  React.useEffect((): (() => void) => {
    return () => dispatch(killAllStateFormValidetion());
  }, []);

  React.useEffect((): void => {
    if (token) {
      dispatch(fetchGetUser({ token })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          if (typeof res.payload === 'object' && res.payload != null) {
            const user = res.payload as User;
            dispatch(
              defaultValues({
                name: user.name,
                email: user.email,
                age: user.age,
                avatar: user.avatar,
                gender: user.gender,
              })
            );
            setTown(user.town);
          }
        }
      });

      catList(allTown, 10);
    }
  }, []);

  const findNoCoincidenceForm = (
    value1: User,
    value2: FormValidetionValue
  ): boolean => {
    const valid =
      value1.age === value2.age &&
      value1.avatar === value2.avatar &&
      value1.email === value2.email &&
      value1.gender === value2.gender &&
      value1.name === value2.name &&
      user?.town === town;
    return valid;
  };

  const deleteTextAnswerServer = (): void => {
    setTimeout(() => {
      dispatch(addTextSuccess(''));
      dispatch(setSuccessRequest(false));
    }, 1500);
  };

  const hendelSumit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (user) {
      if (findNoCoincidenceForm(user, value)) {
        dispatch(addTextSuccess('изменения сохранены'));
        dispatch(setSuccessRequest(true));
        deleteTextAnswerServer();
      } else {
        if (token) {
          dispatch(fetchPatchUser({ token, town })).then(() => {
            deleteTextAnswerServer();
          });
        }
      }
    }
  };

  const changeValue = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(
      setValue({
        value: evt.target.value,
        name: evt.target.name,
        errors: evt.target.validationMessage,
        valid: evt.target.closest('form')?.checkValidity(),
      })
    );
  };

  const openListTown = (): void => {
    const clue = townRef.current?.getBoundingClientRect();
    if (clue) {
      isCitiesTop(clue.height);
      isListTown(!listTown);
    }
  };

  const changeValueTown = (town: string) => {
    setTown(town);
    openListTown();
    dispatch(setValid(true));
  };

  let search = true;
  const searchTown = (evt, arr, time) => {
    if (search) {
      setTimeout(() => {
        const newArr = arr.filter((val) =>
          val.city.toLowerCase().includes(evt.target.value.toLowerCase())
        );
        catList(newArr, 10);
        search = true;
      }, time);
      search = false;
    }
  };

  return (
    <div className={Style.conteiner}>
      <div className={Style.conteinerButton}>
        <ButtonsNavigation page={'/my-page'} text={'Назад'} />
        <ButtonsNavigation page={'/'} text={'На главную'} />
      </div>
      <UserAvatarEdit />
      {showSceletonPage ? (
        <FormEditUserPreloader />
      ) : errServer ? (
        <ErrServer textErr="На сервере произошла ошибка, попробуйте зайти позже." />
      ) : (
        <form onSubmit={(evt) => hendelSumit(evt)} className={Style.form}>
          <label className={Style.title}>ваше имя</label>
          <input
            pattern="^\S*$"
            value={value.name ?? ''}
            onChange={(evt) => changeValue(evt)}
            name="name"
            placeholder="ввидите имя"
            required
            minLength={1}
            maxLength={30}
          ></input>
          <TextInteractionForm text={errors.name} />
          <div className={Style.conteiner_age_gender}>
            <label className={Style.title}>возраст</label>
            <input
              className={Style.age}
              value={value.age ?? ''}
              onChange={(evt) => changeValue(evt)}
              name="age"
              type="number"
              min={18}
              max={80}
              placeholder="выберите ваш возраст"
              required
            ></input>
            <label className={Style.title}>м</label>
            <input
              checked={value.gender === 'м' ? 'checked' : ''}
              className={Style.radio}
              value="м"
              onChange={(evt) => changeValue(evt)}
              type="radio"
              name="gender"
              placeholder="ввидите пол"
            ></input>

            <label className={Style.title}>ж</label>
            <input
              checked={value.gender === 'ж' ? 'checked' : ''}
              className={Style.radio}
              value="ж"
              onChange={(evt) => changeValue(evt)}
              type="radio"
              name="gender"
              placeholder="ввидите пол"
            ></input>
          </div>
          <div ref={townRef} className={Style.conteiner_town}>
            <p className={Style.town}>{town}</p>
            <div
              onClick={() => openListTown()}
              className={Style.conteiner_label_town}
            >
              <label className={Style.label_town}>выберите ваш город</label>
              <div
                className={
                  listTown
                    ? `${Style.label_icon_off} ${Style.label_icon_onn}`
                    : Style.label_icon_off
                }
              ></div>
            </div>
            <ul
              ref={sityRef}
              onScroll={(evt) => addSityInList(evt, showCities)}
              className={
                listTown
                  ? `${Style.cities}`
                  : `${Style.cities} ${Style.cities_off}`
              }
              style={{ top: citiesTop }}
            >
              <input
                onChange={(evt) => searchTown(evt, allTown, 1000)}
                placeholder="поиск"
              ></input>
              {showCities?.map((town, i) => (
                <li
                  onClick={() =>
                    changeValueTown(`${town.city} (${town.region})`)
                  }
                  className={Style.list_town}
                  key={i}
                >
                  {`${town.city} (${town.region})`}
                </li>
              ))}
            </ul>
          </div>
          <label className={Style.title}>email</label>
          <input
            pattern="^\S*$"
            value={value.email ?? ''}
            onChange={(evt) => changeValue(evt)}
            name="email"
            type="email"
            placeholder="ввидите your email"
            required
            minLength={5}
            maxLength={50}
          ></input>
          <TextInteractionForm text={errors.email} />
          <ButtonSubmit
            valid={valid}
            showPreloader={showPreloader}
            successRequest={successRequest}
            textAnswerRequest={textAnswerRequest}
            text={'редактировать профиль'}
          />
        </form>
      )}
    </div>
  );
}
