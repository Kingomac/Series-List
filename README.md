# Series List

## Configuration

To build the app you need a config file `app.config.ts` and a `.env` with this structure:

> Requires Nodejs >=14.x
> `app.config.ts`

```typescript
export const FIREBASE_KEYS = {
  apiKey: "############################",
  authDomain: "########################",
  databaseURL: "#######################",
  projectId: "#########################",
  storageBucket: "#####################",
  messagingSenderId: "#################",
  appId: "#############################",
};

export const APP_NAME: string = "Series List Next";
export const SERIES_LIMIT: number = 14;
export const SUDO_EMAILS: (string | RegExp)[] =
  process.env.NODE_ENV == "dev" ? [/@/] : ["someone@gmail.com"]; // Use regular expressions or strings
// This way in DEBUG any email is sudo and in PRODUCTION just someone@gmail.com

export function isDebug() {
  // this function is just to improve project readibility
  return process.env.NODE_ENV == "dev";
}
```

`.env`

```
NODE_ENV=dev // or prod
```

## Scripts

- `npm run serve`: runs parcel development server with hot reload
- `npm run emulators`: runs firebase emulators
- `npm run dev` : development server with emulators
- `npm run build` : production build. Optional parameters `compression=null(default)/brotli/gzip`
