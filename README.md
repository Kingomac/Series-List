# Series List

## Configuration

To build the app you need a config file `app.config.ts` with this structure:

```typescript
import AppModes from "./src/interfaces/AppModes";

export const FirebaseKeys = {
  apiKey: "############################",
  authDomain: "########################",
  databaseURL: "#######################",
  projectId: "#########################",
  storageBucket: "#####################",
  messagingSenderId: "#################",
  appId: "#############################",
};
export const APP_NAME = "Series List Next";
export const SERIES_LIMIT = 14;
export const SUDO_EMAILS = ["email@gmail.com"];
export const APP_MODE = AppModes.PRODUCTION; // while dev use AppModes.DEBUG
```

## Scripts

- `npm run dev` : development server
- `npm run build` : production build
