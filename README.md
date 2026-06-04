# Notice Board

A responsive notice board built for the Reno Platforms web internship assignment.

## Stack

- Next.js Pages Router
- Prisma ORM
- MySQL-compatible hosted database
- Tailwind CSS

## Features

- Create, read, update, and delete notices end to end
- Server-side validation inside API routes
- Urgent notices ordered first in the database query
- Delete confirmation before destructive actions
- Responsive cards for phone and desktop
- Optional notice image stored as a URL or uploaded data URL

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the project root and set your hosted MySQL connection string. For TiDB Cloud, include `?sslaccept=strict`:

```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE?sslaccept=strict"
```

3. Generate the Prisma client:

```bash
npm run db:generate
```

4. Push the schema to the database:

```bash
npm run db:push
```

5. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run start` - start the production server
- `npm run lint` - run ESLint
- `npm run db:generate` - generate Prisma Client
- `npm run db:push` - sync the schema to the database

## Deployment

Deploy to Vercel and set the same `DATABASE_URL` environment variable in the project settings.

The app uses a hosted MySQL-compatible database so data persists across refreshes and redeploys.

## AI Usage

AI was used to scaffold the initial implementation, accelerate Prisma v7 configuration adjustments, and help draft the README. The CRUD logic, server-side validation, and UI decisions were reviewed and edited in this repository.

## One Improvement With More Time

Add authenticated moderation tools and a proper image upload flow backed by object storage instead of storing image data directly in the database.
