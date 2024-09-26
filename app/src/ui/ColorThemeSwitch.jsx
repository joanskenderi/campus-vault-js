import { FaMoon, FaSun } from 'react-icons/fa';

import { useColorTheme } from '../hooks/useColorTheme';

const ColorThemeSwitch = () => {
  const [colorTheme, setColorTheme] = useColorTheme();

  return (
    <div className="relative m-0 block h-8 w-14 rounded-full bg-light-secondary">
      <input
        type="checkbox"
        onChange={() =>
          setColorTheme(colorTheme === 'light' ? 'dark' : 'light')
        }
        className="absolute top-0 left-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        style={{ outline: 'none', boxShadow: 'none' }}
      />
      <span
        className={`absolute top-1/2 left-1 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-light-primary shadow-md transition-transform duration-75 ease-linear ${
          colorTheme === 'dark' ? 'transform translate-x-full' : 'translate-x-0'
        }`}
      >
        {colorTheme === 'dark' ? (
          <FaMoon size={16} color="blue" />
        ) : (
          <FaSun size={16} color="gray" />
        )}
      </span>
    </div>
  );
};

export default ColorThemeSwitch;
