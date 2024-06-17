import {useEffect, useState} from 'react';
import {Appearance} from 'react-native';

const useTheme = () => {
  const [colorScheme, setColorScheme] = useState('light');

  const toggleTheme = () => {
    setColorScheme(prevColorScheme =>
      prevColorScheme === 'light' ? 'dark' : 'light',
    );
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setColorScheme(colorScheme);
    });

    Appearance.getColorScheme(colorScheme => {
      setColorScheme(colorScheme);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {colorScheme, toggleTheme};
};

export default useTheme;
