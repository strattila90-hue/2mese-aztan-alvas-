# Contributing

## English
1. Run locally: `python3 -m http.server 8801`, open `http://localhost:8801/index.html`. No build step.
2. Check syntax of every script: `for f in *.js; do node --check "$f" || echo "ERR $f"; done`, then click through the app and make sure the browser console shows no errors.
3. Style: plain vanilla JS, no dependencies, UI text in Hungarian, small and readable changes. Do not add modern copyrighted stories (folk tales are fine).
4. When you change anything users get, bump `v` in `version.json` and the `C` cache name in `sw.js` (e.g. `mesevar-v38` to `mesevar-v39`), otherwise installed apps will not update.
5. Open a pull request with a short description of what and why (a screenshot helps).

## Magyar
1. Helyi futtatás: `python3 -m http.server 8801`, majd `http://localhost:8801/index.html`. Nincs build.
2. Szintaxis-ellenőrzés: `for f in *.js; do node --check "$f" || echo "HIBA $f"; done`, utána kattints végig az appon, és nézd meg, hogy a konzolban nincs hiba.
3. Stílus: sima JS, nincs függőség, a felület szövege magyar, kicsi és olvasható változtatások. Modern, szerzői jogvédett mesét ne adj hozzá (a népmesék rendben vannak).
4. Ha a felhasználók számára látható dolgot változtatsz, növeld a `version.json` `v` értékét és az `sw.js` `C` gyorsítótár-nevét (pl. `mesevar-v38` -> `mesevar-v39`), különben a telepített appok nem frissülnek.
5. Pull requestben írd le röviden, mit és miért változtattál (képernyőkép jöhet).
