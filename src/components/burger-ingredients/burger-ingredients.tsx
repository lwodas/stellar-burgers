import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAppSelector, useAppDispatch } from '../../services/store';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '../ui/preloader';

export const BurgerIngredients: FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(
    (state) => state.ingredients
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewSauces) setCurrentTab('sauce');
    else if (inViewFilling) setCurrentTab('main');
  }, [inViewBuns, inViewFilling, inViewSauces]);

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun' && titleBunRef.current) {
      titleBunRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (tab === 'main' && titleMainRef.current) {
      titleMainRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (tab === 'sauce' && titleSaucesRef.current) {
      titleSaucesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return <Preloader />;
  if (error) return <div>Ошибка: {error}</div>;

  const buns = items.filter((item) => item.type === 'bun');
  const mains = items.filter((item) => item.type === 'main');
  const sauces = items.filter((item) => item.type === 'sauce');

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
