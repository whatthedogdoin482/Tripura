# Server-Datenspeicher (Entwicklung)

API-Routen nutzen `lib/db/memory.ts`: Nutzer, Login-Tokens, Umfragen und Bestellungen liegen **nur im RAM** des Node-Prozesses.

- Daten gehen bei `npm run dev` / Deploy-Neustart verloren.
- Später kann hier z. B. PostgreSQL, SQLite oder ein anderer Anbieter angebunden werden.
