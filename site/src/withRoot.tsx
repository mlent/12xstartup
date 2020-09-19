import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Global, css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import CssBaseline from '@material-ui/core/CssBaseline';
import { StylesProvider } from '@material-ui/styles';
// @ts-ignore
import getPageContext from './getPageContext';
import { COMBINED_THEME } from './themes';

const styles = css`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-image: -webkit-gradient(
      linear,
      left top,
      left bottom,
      from(#20153f),
      to(#1b1b35)
    );
    font-family: 'Open Sans', sans-serif;
    overflow-x: hidden;
    color: hsla(0, 0%, 100%, 0.8);
  }

  a {
    outline: 0;
    text-decoration: none;
    transition: 0.7s;
    color: inherit;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(51, 217, 178, 0.7);
    }

    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(51, 217, 178, 0);
    }

    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(51, 217, 178, 0);
    }
  }
`;

function withRoot(Component: any) {
  class WithRoot extends React.Component {
    muiPageContext: any | undefined;

    constructor(props: any) {
      super(props);
      this.muiPageContext = getPageContext();
    }

    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return (
        <StylesProvider
          generateClassName={this.muiPageContext.generateClassName}
        >
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <>
            <MuiThemeProvider theme={this.muiPageContext.theme}>
              {(() => {
                return (
                  // @ts-ignore
                  <>
                    <CssBaseline />
                    <ThemeProvider theme={COMBINED_THEME}>
                      <Component {...this.props} />
                    </ThemeProvider>
                  </>
                );
              })()}
            </MuiThemeProvider>
            <Global styles={styles} />
          </>
        </StylesProvider>
      );
    }
  }

  return WithRoot;
}

export default withRoot;
