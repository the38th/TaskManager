import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

export default function MUITheme(props) {
  return <ThemeProvider theme={darkTheme}>{props.children}</ThemeProvider>;
}
