## Running the site

```
yarn # Install dependencies
yarn workspace site develop
```

This will run the website with fixture data (found in site/src/static/fixture.json)
instead of contacting Airtable and Slack at:

https://localhost:8000

To pull live data assuming you have Netlify local development
set up, use ?live=anything at the end of the url.

https://localhost:8888?live
