# Series List

## Configuration

To build the app you need a config file `app.config.ts` with this structure:

```typescript
import AppModes from "./src/interfaces/AppModes";

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
export const APP_MODE: AppModes = AppModes.DEBUG; // while dev use AppModes.DEBUG
export const SUDO_EMAILS: (string | RegExp)[] =
  APP_MODE === AppModes.DEBUG ? [/@/] : ["someone@gmail.com"]; // Use regular expressions or strings
// This way in DEBUG any email is sudo and in PRODUCTION just someone@gmail.com
```

## Scripts

- `npm run dev` : development server
- `npm run build` : production build
