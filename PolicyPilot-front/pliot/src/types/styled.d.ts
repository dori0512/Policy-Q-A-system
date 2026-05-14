import { Theme } from '../styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    palette: {
      primary: {
        main: string;
        contrastText: string;
      };
      background: {
        default: string;
        paper: string;
      };
      text: {
        primary: string;
        secondary: string;
      };
    };
  }
}