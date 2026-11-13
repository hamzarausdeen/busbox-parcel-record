# BusBox Parcel Collection Record System

A web-based application for maintaining parcel collection records. The current version provides an administrator dashboard, parcel registration, and parcel management.

## Features

- Dashboard showing total, Available, and Collected parcel counts
- Recent parcel records
- Add parcel with client-side and server-side validation
- Search and filter parcel records
- Edit parcel details
- Mark a parcel as Collected
- Delete parcel records
- MySQL persistence through Prisma

## Technology Stack

- Next.js and React
- JavaScript
- Tailwind CSS
- Next.js API route handlers
- MySQL
- Prisma ORM
- Prisma MariaDB adapter

## Requirements

- Node.js (use a version compatible with the project's Next.js dependencies)
- MySQL Server
- npm

## Setup

1. Clone or copy the project to your computer.
2. Open the project directory in Visual Studio Code.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create the MySQL database:

   ```sql
   CREATE DATABASE busbox_db;
   ```

5. Create a local `.env` file in the project root and configure `DATABASE_URL` in the format expected by the project's Prisma configuration. Use your own local MySQL username, password, host, port, and database name. URL-encode reserved characters in credentials.
6. Run the Prisma migration/setup command already configured for this project. For this project, check `prisma7.config.ts` and `package.json` for the exact Prisma 7 command and configuration.
7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000).

## Production Build

To verify the production build:

```bash
npm run build
```

The project developer reports that this command completed successfully during final verification.

## Main Pages

- `/` — Dashboard
- `/add-parcel` — Add Parcel
- `/manage-parcel` — Manage Parcels

## API

The application uses `/api/parcels`:

| Method | Purpose |
|---|---|
| GET | Retrieve parcel records |
| POST | Create a parcel |
| PUT | Update parcel details |
| PATCH | Mark a parcel as collected |
| DELETE | Delete a parcel |

## Data Model

The `Parcel` model contains:

- `id` — auto-incrementing primary key
- `referenceNo` — unique parcel reference
- `receiverName` — receiver name
- `phone` — receiver contact number
- `description` — optional parcel description
- `status` — defaults to `Available`; can be `Collected`
- `createdAt` — creation timestamp
- `updatedAt` — last-update timestamp

## Security and Submission Notes

- Never commit or submit the real `.env` file.
- Do not publish database passwords or credentials.
- Provide a sanitized `.env.example` with placeholder values if required.
- The current application is an administrator-facing mini project; authentication is not included in the described scope.

## Testing

The developer reports that the functional test checklist and production build were completed. Add actual screenshots and any required test evidence to the project report before submission.
