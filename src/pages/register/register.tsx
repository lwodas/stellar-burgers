import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { registerUserApi } from '../../utils/burger-api';
import { setCookie } from '../../utils/cookie';
import { useAppDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/slices/authSlice';

export const Register: FC = () => {
  const dispatch = useAppDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setErrorText('');

    try {
      const res = await registerUserApi({ name: userName, email, password });

      setCookie('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);

      await dispatch(checkUserAuth());
      navigate('/');
    } catch (err: any) {
      setErrorText(err.message || 'Произошла ошибка регистрации');
    }
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
