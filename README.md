# 🎁 My Sui Wrapped

> **Discover your on-chain identity on the Sui Blockchain.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Prisma](https://img.shields.io/badge/Prisma-white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![TanStack Start](https://img.shields.io/badge/Framework-TanStack_Start-red)

**My Sui Wrapped** is a data visualization platform that analyzes a user's transaction history on the Sui Network to generate a personalized "Year in Review." It indexes on-chain data to calculate trading volume, identify top interacted assets, and classify users into behavioral archetypes (e.g., "Diamond Hands," "Degen," or "NFT Collector").

---

## ✨ Key Features

* **📊 Financial Analytics:**
    * Total Volume (USD), Inflow vs. Outflow.
    * Biggest Transaction tracking.
    * Peak activity days.
* **🎭 User Archetypes:**
    * Algorithmic classification of users based on tx frequency and asset holding time.
    * **Rank Percentile:** See where you stand among all Sui users.
* **🤝 Social Graph:**
    * **Top Interactors:** Visualizes which addresses you interact with most.
    * **Top Assets:** Breakdown of your most traded tokens/NFTs.
* **🚀 High Performance:**
    * Built with **TanStack Start** for server-side rendering.
    * Leverages **Supabase Connection Pooling** for high-concurrency read operations.

---

## 🛠 Tech Stack

* **Framework:** [TanStack Start](https://tanstack.com/start/latest) (React)
* **Language:** TypeScript
* **Database:** PostgreSQL (via [Supabase](https://supabase.com))
* **ORM:** [Prisma](https://www.prisma.io/) (v7.2.0)
* **Blockchain SDK:** @mysten/sui.js
* **Styling:** Tailwind CSS

---

## 🗄 Database Schema

The core logic relies on three main models defined in `prisma/schema.prisma`:

| Model | Description |
| :--- | :--- |
| **User** | Stores the wallet address and indexing status (`isIndexed`, `lastIndexedAt`). |
| **UserStats** | The heavy lifter. Stores calculated metrics like `totalVolumeUSD`, `archetype`, `topAssets` (JSON), and `rankPercentile`. |
| **Transaction** | Caches specific transactions (`digest`, `timestamp`, `balanceChanges`) for historical lookups. |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/Verifieddanny/my-sui-wrapped.git](https://github.com/Verifieddanny/my-sui-wrapped.git)
cd my-sui-wrapped
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env` file in the root directory. You need two database URLs for Supabase to handle migrations correctly.

```bash
# Port 6543 (Pooler) - Used for the App (Queries)
DATABASE_URL="postgresql://postgres.projectid:password@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Port 5432 (Direct) - Used for Migrations
DIRECT_URL="postgresql://postgres:password@db.projectid.supabase.co:5432/postgres?connect_timeout=30"

COIN_GECKO_API="api key"
```

**Note:** The `?connect_timeout=30` in the DIRECT_URL is crucial for preventing timeout errors during migrations on slower networks.

### 4. Run Database Migrations
We use the new `prisma.config.ts` setup.
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the Development Server
```bash
npm run dev
```

---

## ⚠️ Database Management (Supabase + Prisma)

This project uses **Prisma v7+** with a custom configuration file `prisma.config.ts`.

* **Runtime Operations:** The application connects via the **Transaction Pooler** (Port 6543) defined in `DATABASE_URL`. This allows for thousands of concurrent users.
* **CLI Operations (Migrations):** Prisma CLI operations connect via the **Direct Connection** (Port 5432) defined in `DIRECT_URL`.

**If you encounter `P1001: Can't reach database server` during migration:**

1. Check that `DIRECT_URL` is using port `5432`.
2. Ensure you have `?connect_timeout=30` appended to the URL string.
3. Verify your IP is allowed in Supabase Network settings (if restricted).

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 👤 Author

**Danny**

* GitHub: [@Verifieddanny](https://github.com/Verifieddanny)
* X (Twitter): [@dannyclassi_c](https://x.com/dannyclassi_c)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

