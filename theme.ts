import { createTheme, MantineColorsTuple } from '@mantine/core';

// 1. Generate a custom 10-shade scale for your brand color (Vibrant Purple)
const corporateBrandColors: MantineColorsTuple = [
  '#f5f0ff', // Shade 0: Light backgrounds
  '#e6dbff', // Shade 1
  '#ccb5ff', // Shade 2
  '#b08aff', // Shade 3
  '#9663ff', // Shade 4
  '#8447ff', // Shade 5
  '#7431f7', // Shade 6: Primary default button color
  '#6324de', // Shade 7: Button hover state
  '#511cc4', // Shade 8
  '#3f13a3'  // Shade 9: Deep text accents
];

export const theme = createTheme({
  // 2. Set the default color for your entire website
  primaryColor: 'violetBrand',
  
  colors: {
    violetBrand: corporateBrandColors,
  },

  // 3. Customize default component behaviors globally
  components: {
    Button: {
      defaultProps: {
        radius: 'xl', // Makes buttons perfectly pill-shaped across the site
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg', // Applies modern rounded edges to pricing and features cards
      },
    },
  },
});
