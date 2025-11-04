import { Platform } from 'react-native';

const lime = '#C9F158';
const softLime = '#C9F158';
const softBlack = '#232526';
const darkGray = '#2C2C2E';
const lightGray = '#F8F8FA';
const white = '#FFFFFF';
const gradientLight = [lime, white];
const gradientDark = [softBlack, lime];

export const Colors = {
  light: {
    text: '#222428',
    buttomText: '#222428',
    background: white,
    neutral: darkGray,
    primary: lime,
    secondary: softBlack,
    icon: lime,
    tabIconDefault: darkGray,
    tabIconSelected: softBlack,
    correct: '#7ED957',
    uncorrect: '#FF1744',
    button: lime,
    base: softLime,
    gradient: gradientLight,
    card: lightGray,
    border: '#E0E0E0',
    shadow: 'rgba(199,244,100,0.08)',
  },
  dark: {
    text: white,
    buttomText: '#222428',
    background: softBlack,
    neutral: darkGray,
    primary: lime,
    secondary: lightGray,
    icon: lime,
    tabIconDefault: lightGray,
    tabIconSelected: lime,
    correct: '#7ED957',
    uncorrect: '#FF1744',
    button: lime,
    base: darkGray,
    gradient: gradientDark,
    card: '#292929',
    border: '#444',
    shadow: 'rgba(199,244,100,0.12)',
  },
};

export const Fonts = Platform.select({
  ios: {
    regular: 'Regular',
    bold: 'Bold',
    sans: 'Regular',
    serif: 'Regular',
    rounded: 'Italic',
    mono: 'Regular'
  },
  default: {
    regular: 'Regular',
    bold: 'Bold',
    sans: 'Regular',
    serif: 'Regular',
    rounded: 'Italic',
    mono: 'Regular'
  },
  web: {
    regular: 'Regular',
    bold: 'Bold',
    sans: 'Regular',
    serif: 'Regular',
    rounded: 'Italic',
    mono: 'Regular'
  },
});
