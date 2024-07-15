# react-ionic-gsheet-base
Ionic React Application to map with configured google sheet to perform basic CRUD operations and other task mentioned below:
- List all contents of the sheet with Lazy Loading
- Add new content
- Edit existing content
- Delete existing content
- Widget based on column type while adding and editing
- Info tab having ability to share the application
- Control over branding (Titles, Colors, etc)

<!-- [![Netlify Status](https://api.netlify.com/api/v1/badges/d139fcbb-a65f-4e2a-b024-cd23738fc48f/deploy-status)](https://app.netlify.com/sites/aastha-health-plus-physio-tracker-v2/deploys) -->

<!-- https://aastha-health-plus-physio-tracker-v2.netlify.app/ -->

## Setup Steps

### Google Sheets Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/) to get API key for Google Sheets API.
2. Create a Google Sheet and add some data. See [example sheet](https://docs.google.com/spreadsheets/d/1zbEyIfga05-gXTCVGejJHpl8ZrlcTYanvgnQBa1t2DM/edit#gid=0).
3. Share it with "Anyone with this link can view".
4. Get sheet id from url of the sheet.

```html
https://docs.google.com/spreadsheets/d/[THIS-IS-THE-SHEET-ID]/
```

5. Add API key and sheet id to `.env` file in variables `REACT_APP_GOOGLE_API_KEY=` and `REACT_APP_GOOGLE_SHEETS_ID=` respectively

## Extra Notes

### It uses https://github.com/robinmoisson/staticrypt for password protecting pages

### Add 'STATICRYPT_PASSWORD' environment variable with actual password to protect the pages
