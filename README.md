# 2mese és alvás 🌙

Esti mese app 3–6 éveseknek. Sima HTML, nincs build: GitHubra feltöltöd, Vercelben importálod, kész.

## Telepítés
1. Tedd a fájlokat (`index.html`, `stories.js`) a repo gyökerébe.
2. Vercel → Add New Project → válaszd a repót → Deploy (Framework: Other).

## Új mese
A `stories.js` végére másolj be egy blokkot (id, cím, kategória, emoji, két szín, szöveg bekezdésekben).
Valódi kép: tedd az `img/` mappába, és add meg `"img":"img/id.webp"` – (a kódban a `.img` és `.cover` elemhez adható).

## Megjegyzés
A felolvasás a telefon beépített magyar hangját használja; Androidon/iOS-en a beállításokban érdemes a jobb minőségű magyar hangot letölteni.
A népmesék közkincsek; a modern szerzői művek (pl. Bogyó és Babóca) védettek, azokat ne másold be.

## Frissítés
Az app indításkor és visszatéréskor magától ellenőrzi a `version.json` számát. Új mese vagy módosítás feltöltésekor növeld a `v` értékét (pl. `{"v":"9"}`), és a telefonok maguktól frissülnek (a mese végén, olvasás közben nem szakítja meg). Kézzel: 🔄 gomb a főoldal jobb felső sarkában.
