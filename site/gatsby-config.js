module.exports = {
  siteMetadata: {
    htmlLang: 'en',
    contentLang: 'en-us',
    title: 'Blogging for Devs: Free Email Course & Newsletter',
    titleTemplate: '%s · Blogging for Devs',
    description:
      'Learn how to write content that reaches thousands without an existing audience.',
    siteUrl: 'https://bloggingfordevs.com',
    siteName: 'Blogging for Devs: Free Email Course & Newsletter',
    logoUrl: '/images/logo.png',
    logoLabel: 'Blogging for Devs',
    logoSubLabel: 'Free Email Course',
    searchText: 'Search',
    faviconUrl: '/images/favicon.png',
    socialSharingImageUrl: '/images/social-sharing-preview.png',
    twitter: '@monicalent',
    facebookUrl: 'https://www.facebook.com/yourpage',
    ctaButtonText: 'Get the free course',
    ctaButtonUrl: '#signup',
    linkText: '',
    linkUrl: '',
    headline: "You don't have to be Twitter-famous to grow your blog",
    footerText: 'Back to main website',
    footerUrl: 'https://monicalent.com',
    googleTagManagerId: 'UA-165916146-1',
    googleAnalyticsMeasurementId: 'UA-165916146-1'
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
