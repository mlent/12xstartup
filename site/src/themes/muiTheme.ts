import { createMuiTheme } from '@material-ui/core';
import { COLORS } from './colors';

let theme = createMuiTheme({
  typography: {
    fontFamily: 'Open Sans, sans-serif'
  },
  palette: {
    primary: COLORS.primary
  },
  shape: {
    borderRadius: 8
  }
});

theme = {
  ...theme,
  overrides: {
    MuiCard: {
      root: {
        padding: theme.spacing(2)
      }
    },
    MuiDrawer: {
      paper: {
        backgroundColor: '#fff'
      }
    },
    MuiButton: {
      containedPrimary: {
        backgroundColor: '#1f1f1f',
        boxShadow: '0 1px 5px 0px rgba(0,80,179,0.3)',
        fontWeight: 700,
        '&:disabled': {
          background: 'rgba(0, 0, 0, 0.12)',
          fontWeight: 'normal'
        },
        '&:hover': {
          backgroundColor: '#141414'
        }
      },
      label: {
        textTransform: 'initial'
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none'
        }
      }
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing()
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3
      }
    },
    MuiTab: {
      root: {
        textTransform: 'initial',
        margin: '0 16px',
        minWidth: 0,
        [theme.breakpoints.up('md')]: {
          minWidth: 0
        }
      }
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing()
      }
    },
    MuiSvgIcon: {
      fontSizeSmall: {
        fontSize: '16px'
      }
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4
      }
    },
    MuiDivider: {
      root: {
        backgroundColor: '#404854'
      }
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium
      }
    },
    MuiPaper: {
      root: {
        color: '#434343'
      },
      elevation1: {
        color: '#434343',
        boxShadow: '0px 4px 12px 10px rgba(0, 0, 0, 0.05)'
      },
      elevation3: {
        color: '#434343',
        boxShadow: '0 1px 5px 0px #0050b3'
      },
      elevation8: {
        color: '#434343',
        boxShadow: '0 1px 5px 0px #0050b3'
      }
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20
        }
      }
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32
      }
    },
    MuiTable: {
      stickyHeader: {
        backgroundColor: theme.palette.background.paper
      }
    },
    MuiTableCell: {
      stickyHeader: {
        backgroundColor: theme.palette.background.paper
      }
    },
    // @ts-ignore
    MuiToggleButtonGroup: {
      root: {
        // border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: theme.shape.borderRadius
      },
      selected: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      }
    },
    // @ts-ignore
    MuiToggleButton: {
      root: {
        background: 'none',
        color: theme.palette.primary.main,
        border: 'none',
        '&:hover': {
          backgroundColor: `${theme.palette.primary.dark} !important`,
          color: `${theme.palette.primary.contrastText} !important`
        }
      },
      selected: {
        backgroundColor: `${theme.palette.primary.main} !important`,
        color: `${theme.palette.primary.contrastText} !important`
      }
    }
  },
  props: {
    MuiTab: {
      disableRipple: true
    }
  },
  mixins: {
    ...theme.mixins,
    toolbar: {
      minHeight: 48
    }
  }
};

export default theme;
