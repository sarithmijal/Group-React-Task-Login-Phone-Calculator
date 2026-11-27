import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  styles: {
    global: {
      body: {
        bg: 'gray.950',
        color: 'gray.100',
      },
    },
  },
  colors: {
    gray: {
      950: '#090b10',
    },
  },
});
