module.exports = {
  siteMetadata: {
    htmlLang: 'en',
    contentLang: 'en-us',
    title: '12x Startup: Four makers build open startups every month',
    titleTemplate: '%s · 12x Startup',
    description:
      'Join us as we build in public and each create an open startup per month for a year!',
    siteUrl: 'https://12xstartup.com',
    siteName: '12x Startup: Four makers build open startups every month',
    logoUrl: '/images/logo.png',
    logoLabel: '12x Startup',
    searchText: 'Search',
    faviconUrl: '/favicon.png',
    socialSharingImageUrl: '/images/social-sharing-image.jpg',
    facebookUrl: 'https://www.facebook.com/yourpage',
    googleTagManagerId: 'UA-178445735-1',
    googleAnalyticsMeasurementId: 'UA-178445735-1'
  },
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-material-ui',
      options: {
        stylesProvider: { injectFirst: true }
      }
    },
    'gatsby-plugin-emotion',
    'gatsby-plugin-react-helmet'
  ]
};
