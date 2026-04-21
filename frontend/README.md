This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## MongoDB CRUD demo (Notes)

This frontend includes a simple Next.js + MongoDB CRUD example:

- UI page: `http://localhost:3000/crud-notes`
- API endpoints:
  - `GET /api/notes`
  - `POST /api/notes`
  - `GET /api/notes/:id`
  - `PUT /api/notes/:id`
  - `DELETE /api/notes/:id`

### 1) Configure MongoDB

Copy env template:

```bash
cp .env.example .env.local
```

Set values in `.env.local`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=nextjs_crud_demo
```

Use either local MongoDB or MongoDB Atlas (replace `MONGODB_URI` with your Atlas URI).

### 2) Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/crud-notes`.

### 3) Validation rules

- `title`: required, max 120 chars
- `content`: required, max 2000 chars

Validation is enforced on both client and server API routes.

### 4) Deploy (example: Vercel)

Set the same `MONGODB_URI` and `MONGODB_DB` environment variables in your deployment provider, then redeploy and test the CRUD page in production.

### 5) Optional next improvements

- Add pagination and search
- Add auth and per-user notes
- Add loading skeletons and optimistic updates
- Add automated API and UI tests

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
