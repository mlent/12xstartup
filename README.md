## Adding yourself to the site

1. Add your photo in `/site/static/images`
2. Create a new row in the Airtable under "Participants"
3. Make sure to fill out ALL the fields!
4. Reference your photo as /images/name-of-your-photo.jpg
5. Create a Product and fill out ALL the fields!
6. Reference your Product from your Participant row
7. Open a PR

The only reason you need to open a PR is because this uses @mlent's
Airtable API key, which is not committed to the repo 🙈

After you do that I'll merge locally and push for you :)

## Add your latest blog post to the site

Just open `/site/pages/index.tsx` and find the section and add yourself.

Posts are sorted with the newest ones on top.

## Running the site locally

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
