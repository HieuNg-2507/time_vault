export const theme = {
  colors: {
    primary: {
      '50': '#EAEAF7',
      '100': '#D5D6EF',
      '200': '#B6B6E3',
      '300': '#8C8DD2',
      '400': '#6C6EC6',
      '500': '#3D3F9E',
      '600': '#2F307A',
      '700': '#212255',
      '800': '#131331',
      '900': '#090A18',
    },
    secondary: {
      '50': '#F2FDFC',
      '100': '#DFF9F8',
      '200': '#C5F4F3',
      '300': '#ABEFED',
      '400': '#81E7E5',
      '500': '#41DBD8',
      '600': '#22B3B0',
      '700': '#1A8B89',
      '800': '#136362',
      '900': '#0B3C3B',
      '1000': '#031111',
    },
    territory1: {
      '50': '#FFF8E5',
      '100': '#FFF1CC',
      '200': '#FFEAB3',
      '300': '#FFDF8C',
      '400': '#FFCD4D',
      '500': '#FFB800',
      '600': '#D59900',
      '700': '#AA7B00',
      '800': '#6A4D00',
      '900': '#2A1F00',
    },
    territory2: {
      '50': '#FEEDF2',
      '100': '#FCDAE4',
      '200': '#FABFD0',
      '300': '#F8A4BB',
      '400': '#F46D93',
      '500': '#F85180',
      '600': '#DA114A',
      '700': '#AA0D39',
      '800': '#490619',
      '900': '#180208',
    },
    neutral: {
      '50': '#F9F9F9',
      '100': '#E6E8E7',
      '200': '#D9DCDB',
      '300': '#C6CACA',
      '400': '#ADB3B2',
      '500': '#9BA1A0',
      '600': '#6B7271',
      '700': '#4D5151',
      '800': '#2E3130',
      '900': '#0F1010',
    },
    shades: {
      white: '#FFFFFF',
      black: '#000000',
    },
    ball: {
      teal: {
        background: '#41DBD8',
        border: '#22B3B0',
      },
      yellow: {
        background: '#FFB800',
        border: '#D69B00',
      },
      pink: {
        background: '#F85180',
        border: '#DA114A',
      },
      text: '#F9F9F9',
    },
  },
  typography: {
    fontFamily: 'Outfit',
    ball: {
      fontFamily: 'Outfit_600SemiBold',
      fontWeight: '600' as const,
      fontSize: 19,
      color: '#F9F9F9', // Text color is consistent for all balls
    },
    // Add other text styles like h1, body, etc. here
  },
  sizing: {
    ball: 56,
    ballBorderRadius: 28, // 56 / 2
    ballBorderWidth: 1,
    storageBall: {
      small: 28,
      medium: 34,
      large: 40,
    },
  },
};
