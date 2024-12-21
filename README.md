# Getting Started

## Prerequisites

- **Node.js** (version 16+ recommended)
- **npm** or **yarn**
- A **Git** client if you plan to clone from GitHub

---

## Installation

**Clone this repository** (or download the ZIP):

```bash
git clone https://github.com/YourUsername/ninja-royale.git
cd ninja-royale
```

**Install dependencies** for both client and server.

- **If you have a root `package.json`** with scripts:

  ```bash
  npm run install:all
  ```

  _(This might call `cd client && npm install` and `cd server && npm install` internally.)_

- **Otherwise, install separately**:

  ```bash
  cd client
  npm install

  cd ../server
  npm install
  ```

**Create a `.env` file** (optional):

- If your server requires environment variables (e.g., DB connection strings, API keys), create a `.env` file in `server/` with contents like:

  ```bash
  PORT=3000
  DB_URI=mongodb://localhost:27017/ninja-royale
  ```

- For the client, you can store environment variables in `.env` (or `.env.local`) as well, using Vite’s prefix rules (e.g., `VITE_API_URL=http://localhost:3000`).

---

## Development

**Start the server** (in one terminal):

```bash
cd server
npm run dev
```

This runs `server/src/index.js` (or however you set up the `dev` script) and listens on [http://localhost:3000](http://localhost:3000) by default.

**Start the client** (in another terminal):

```bash
cd client
npm run dev
```

Vite’s dev server will run at [http://localhost:5173](http://localhost:5173) by default.

**Open the Client** in your browser:

```
http://localhost:5173
```

The front-end will communicate with the back-end at [http://localhost:3000](http://localhost:3000) or your configured port.

---

## Production Build

**Build the client** for production:

```bash
cd client
npm run build
```

This outputs the compiled files to `client/dist/`.

**Optional**: Serve the client’s static files from the server:

1. Copy or integrate `client/dist/` into your server’s static folder.
2. Or host `client/dist/` separately on a service like Netlify, Vercel, or any static hosting.

**Start server in production mode**:

```bash
cd server
npm run start
```

This depends on how you configure your server’s production script.
