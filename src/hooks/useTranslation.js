import useEcomStore from '../store/ecom-store';
import { getTranslation } from '../translations';

export const useTranslation = () => {
  const language = useEcomStore((state) => state.language);
  const t = getTranslation(language);
  return t;
};

export default useTranslation;
