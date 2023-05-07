# Proxy and mocking for FE developers

Simple yet powerful TypeScript API proxy with built-in mocking capability.

Allows for easily switching API targets without needing to recompile Angular / React apps.
Also allows to override API response for concrete endpoint, based on path, via `string.startsWith()` or RegExp, or any other custom criteria that you write check for yourself.

## Set up

Install dependencies
```shell
npm install
```

Update Angular and/or React proxies, something like:

```json
{
  "/api": {
    "target": "http://localhost:55555/",
    //...
  },
}
```

## Running

Use watch mode and you can change configuration on-the-fly:
```shell
npm run watch 
```

## Usage
Set up in `config.ts` and `data/mockDb.ts`.

 * Switch between API targets by setting `liveApiTarget` constant.

 * Define mocked responses in `activeRules` constant.

 * Add your API results in `data/api-response-snapshots` folder.

 * Consume and transform them in either:
   * `src/mockDb.ts` and/or 
   * rule entries in `data/rules-collection.ts`.

## Enjoying it?

 * ⭐ Give the repo a star
 * 🍺 [Buy me a beer](https://www.buymeacoffee.com/klimacka)
