# Sree Collections

A full-stack e-commerce project structure with **User Web** (Next.js), **Admin Panel** (Next.js), and a single **Backend** (Node.js/Express + MongoDB).

---

## 📁 Project Structure

```text
sreecollections/
├── apps/
│   ├── user-web/              # [Frontend] Customer Storefront (Next.js, TypeScript, Tailwind)
│   │   ├── app/               # App Router pages (products, cart, checkout, orders, login)
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # State management (Cart, Auth)
│   │   ├── lib/               # API utilities
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   └── tsconfig.json
│   │
│   └── admin-panel/           # [Frontend] Admin Portal (Next.js, TypeScript, Tailwind)
│       ├── app/               # Dashboard pages (products, orders, categories, customers)
│       ├── components/        # Admin UI components & tables
│       ├── context/           # Admin Auth state
│       ├── lib/               # Admin API utilities
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
│
├── backend/                   # [Backend] REST API (Node.js, Express, Mongoose, ES Modules)
│   ├── src/
│   │   ├── config/            # DB and environment configuration
│   │   ├── controllers/       # Route logic (auth, product, category, order, analytics)
│   │   ├── middleware/        # JWT auth and error handling
│   │   ├── models/            # Mongoose schemas (User, Product, Category, Order)
│   │   ├── routes/            # Express routers
│   │   ├── app.js             # Express app setup & middleware
│   │   └── server.js          # HTTP server entry point
│   ├── .env.example
│   └── package.json
│
├── package.json               # Root scripts to run each service
└── .gitignore
```

---

## 🛠️ Languages & Tech Stack

| Application | Language | Framework / Libs |
|---|---|---|
| **User Web** | TypeScript | Next.js (App Router), React 19, Tailwind CSS |
| **Admin Panel** | TypeScript | Next.js (App Router), React 19, Tailwind CSS |
| **Backend** | JavaScript (ESM) | Node.js, Express, Mongoose (MongoDB), JWT |

---

## 🚀 How to Run

### 1. Backend (Port: 5000)
```bash
cd backend
npm install
npm run dev
```

### 2. User Storefront (Port: 3000)
```bash
cd apps/user-web
npm install
npm run dev
```

### 3. Admin Panel (Port: 3001)
```bash
cd apps/admin-panel
npm install
npm run dev
```
