# Series List

## Configuration

To build the app you need a config file `app.config.ts` with this structure:

```typescript
export const FirebaseKeys = {
  apiKey: "### FIREBASE API KEY ###",
  authDomain: "### FIREBASE AUTH DOMAIN ###",
  projectId: "### CLOUD FIRESTORE PROJECT ID ###",
};
```

## Scripts

- `npm run dev` : development server
- `npm run build` : production build
