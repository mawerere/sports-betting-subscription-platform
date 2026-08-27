# TEAM GOLO GOLO

> **Your Game. Your Tips. Your Edge.**

A simple, fast, secure, and mobile-friendly full-stack web application for delivering sports predictions and subscription-based premium tips. Built with Next.js, TypeScript, Tailwind CSS, PostgreSQL, and Drizzle ORM.

---

## ✨ Features

- **Public Landing Page** – Friendly intro, packages, and CTAs.
- **User Auth** – Register, login, forgot password, email verification, profile management.
- **Free Tips** – Available to every registered user.
- **Premium Packages** – Team GOLO golo, Big Starker, and VIP. Each strictly independent.
- **Mobile Money Ready** – Clean abstraction layer for **MTN MoMo** and **Airtel Money** integration.
- **Live Match Previews** – Real-time scores, minutes, and status posted by admins.
- **User Dashboard** – Subscription status, days remaining, predictions, payment history, profile.
- **Super Admin Panel** – Hidden route. Manage users, predictions, subscriptions, live matches, and payments.
- **Responsive Design** – Optimized for mobile, tablet, and desktop.
- **Theme** – Professional blue, gold, and white sports aesthetic.

---

## 🛠 Tech Stack

| Layer    | Technology                |
| -------- | ------------------------- |
| Frontend | React, Next.js 15, TypeScript, Tailwind CSS |
| Backend  | Next.js Server Actions & API Routes |
| Database | PostgreSQL (Neon recommended) |
| ORM      | Drizzle ORM |
| Auth     | JWT in HTTP-Only Cookies, bcrypt |
| Payments | MTN MoMo + Airtel Money (architecture ready) |
| Hosting  | Vercel (Frontend) + Neon (DB) |

---

## 🚀 Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/team-golo-golo.git
cd team-golo-golo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/db?sslmode=require
JWT_SECRET=replace-with-a-long-random-string
SESSION_SECRET=replace-with-a-long-random-string
```

### 4. Apply database schema

```bash
npx drizzle-kit push
```

This pushes the schema to your database.

### 5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 6. Build for production

```bash
npm run build
npm run start
```

---

## 🗄 Database (Neon PostgreSQL)

1. Sign up at [neon.tech](https://neon.tech).
2. Create a new project.
3. Copy the **Pooled connection string** into `DATABASE_URL`.
4. Run the schema push command:

```bash
npx drizzle-kit push
```

---

## 💳 Mobile Money Integration

This project is designed with a **payment provider abstraction** so MTN MoMo and Airtel Money can be plugged in cleanly. The mock implementation simulates a successful payment today.

To enable real payments:

1. Sign up for **MTN MoMo Developer Portal** and **Airtel Money Developer Portal**.
2. Add credentials to `.env` (see `.env.example`).
3. Implement the provider classes inside `src/lib/payments/`:
   - `MTNMoMoProvider.ts`
   - `AirtelMoneyProvider.ts`
4. Call them from `src/app/payment/[packageId]/actions.ts`.

---

## 🏆 Sports Data API

The admin prediction form supports a "Search live match" auto-fill feature. To enable:

1. Sign up at [API-Football](https://www.api-football.com) (or another provider).
2. Add your key to `.env`:

```env
SPORTS_API_URL=https://v3.football.api-sports.io
SPORTS_API_KEY=your_api_key
```

3. Hit the internal mock endpoint at `/api/external-sports` or wire it to the real provider.

---

## 🛡 Admin Access

The admin portal is **completely hidden** from the public navigation.

To log in as the Super Admin:

1. Manually visit `/admin-login`.
2. Use the default seeded credentials (change them immediately!):
   - **Email:** `admin@teamgologo.com`
   - **Password:** `admin123`

---

## 🚀 Deploying to Vercel

1. Push this repo to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. In **Project Settings → Environment Variables**, add everything from your `.env`.
4. Add the **Build Command**:

```bash
npm run build
```

5. Deploy! 🎉

---

## 📄 License

MIT
