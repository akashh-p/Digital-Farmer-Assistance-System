# 🌾 Digital Farmer Assistance System
### Full-Stack Web Application — SE + DBMS Combined Project

---

## 📁 Project Structure

```
farmer-system/
├── server.js            ← Express entry point
├── db.js                ← MySQL connection pool
├── schema.sql           ← Full database schema + seed data
├── .env.example         ← Config template (copy to .env)
├── package.json
├── middleware/
│   └── auth.js          ← JWT authentication middleware
├── routes/
│   ├── auth.js          ← POST /api/auth/farmer/login, /register, /admin/login
│   ├── farmers.js       ← GET/PUT/DELETE /api/farmers
│   ├── market.js        ← GET/POST/PUT/DELETE /api/market
│   ├── weather.js       ← GET/POST/DELETE /api/weather  (OWM API + DB fallback)
│   ├── advisory.js      ← GET/POST/PUT/DELETE /api/advisory
│   ├── queries.js       ← GET/POST/PUT/DELETE /api/queries
│   └── admins.js        ← GET/POST/DELETE /api/admins
└── public/
    └── index.html       ← Full frontend (HTML + CSS + JS)
```

---

## ⚙️ Setup Instructions

### Option A: Docker Setup (Recommended)

**Prerequisites:** Docker and Docker Compose installed.

1. **Navigate to the Project Directory**
   ```bash
   cd farmer-system
   ```
2. **Start the Containers**
   ```bash
   sudo docker compose up -d --build
   ```
   *(Note: The database is automatically created and seeded from `schema.sql` on the first launch. You don't need to configure `.env` manually unless you want to override default values).*
3. **Open the Application**
   Visit: **http://localhost:3000**
4. **View Logs (Optional)**
   ```bash
   sudo docker compose logs -f app
   ```

---

### Option B: Manual Setup

#### 1. Prerequisites
- Node.js v18+
- MySQL 8.0+

#### 2. Install Dependencies
```bash
cd farmer-system
npm install
```

#### 3. Configure Environment
```bash
cp .env.example .env
```
Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=farmer_db
JWT_SECRET=any_long_random_string
WEATHER_API_KEY=DEMO       # or your free key from openweathermap.org
PORT=3000
```

#### 4. Set Up Database
Open MySQL and run:
```bash
mysql -u root -p < schema.sql
```
Or paste `schema.sql` into MySQL Workbench and execute.

#### 5. Start Server
```bash
node server.js
```
Open: **http://localhost:3000**

---

## 🔑 Demo Credentials

| Role        | Credential                      | Password    |
|-------------|----------------------------------|-------------|
| Superadmin  | ravi@farmerassist.in             | admin123    |
| Editor      | priya@farmerassist.in            | admin123    |
| Farmer      | Phone: 9876543210                | farmer123   |
| Farmer      | Phone: 9123456780                | farmer123   |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint                    | Access  | Description            |
|--------|-----------------------------|---------|------------------------|
| POST   | /api/auth/farmer/register   | Public  | Register new farmer    |
| POST   | /api/auth/farmer/login      | Public  | Farmer login → JWT     |
| POST   | /api/auth/admin/login       | Public  | Admin login → JWT      |

### Market Prices
| Method | Endpoint            | Access      | Description              |
|--------|---------------------|-------------|--------------------------|
| GET    | /api/market         | Public      | All prices, ?crop= filter|
| POST   | /api/market         | Admin       | Add price record         |
| PUT    | /api/market/:id     | Admin       | Update price             |
| DELETE | /api/market/:id     | Admin       | Delete record            |

### Weather
| Method | Endpoint                      | Access | Description                      |
|--------|-------------------------------|--------|----------------------------------|
| GET    | /api/weather?locations=X,Y,Z  | Public | Live from OWM API or DB fallback |
| GET    | /api/weather/alerts           | Public | Extreme weather locations        |
| POST   | /api/weather                  | Admin  | Manual forecast entry            |
| DELETE | /api/weather/:id              | Admin  | Delete forecast                  |

### Advisory
| Method | Endpoint                  | Access  | Description                        |
|--------|---------------------------|---------|------------------------------------|
| GET    | /api/advisory             | Public  | Filter by ?crop=&season=&lang=     |
| GET    | /api/advisory/for-farmer  | Farmer  | Returns advisories for your crops  |
| POST   | /api/advisory             | Admin   | Publish new advisory               |
| PUT    | /api/advisory/:id         | Admin   | Update advisory                    |
| DELETE | /api/advisory/:id         | Admin   | Delete advisory                    |

### Queries
| Method | Endpoint                      | Access  | Description               |
|--------|-------------------------------|---------|---------------------------|
| GET    | /api/queries                  | Auth    | Admin: all; Farmer: own   |
| POST   | /api/queries                  | Farmer  | Submit query              |
| PUT    | /api/queries/:id/respond      | Admin   | Post expert response      |
| PUT    | /api/queries/:id/close        | Auth    | Close a query             |
| DELETE | /api/queries/:id              | Admin   | Delete query              |

### Farmers & Admins
| Method | Endpoint        | Access      |
|--------|-----------------|-------------|
| GET    | /api/farmers    | Admin       |
| GET    | /api/farmers/me | Farmer      |
| PUT    | /api/farmers/me | Farmer      |
| GET    | /api/admins     | Admin       |
| POST   | /api/admins     | Superadmin  |

### Dashboard
| Method | Endpoint   | Access | Returns                              |
|--------|------------|--------|--------------------------------------|
| GET    | /api/stats | Auth   | Counts + extreme weather alert list  |

---

## 🏗 Architecture (matches your modules)

| Module (from spec)           | Implementation                                      |
|------------------------------|-----------------------------------------------------|
| User Interface Module        | `public/index.html` — mobile-first responsive HTML  |
| Multilingual Support         | DB `language` field in ADVISORY + farmer pref       |
| User Management Module       | `routes/auth.js` + bcrypt passwords + JWT roles     |
| Advisory Engine Module       | `routes/advisory.js` — crop + season + stage filter |
| Alert Manager Module         | `is_extreme` flag in WEATHER_FORECAST, stats alert  |
| Market Price Integration     | `routes/market.js` — DB + admin manual input        |
| Weather Service Module       | `routes/weather.js` — OWM API → DB fallback → mock  |
| Data Persistence Module      | MySQL via `db.js` (mysql2 pool)                     |
| Content Management Module    | Admin panel: advisories, prices, weather CRUD       |

---

## 🌤 Weather API (optional)

Get a free API key from https://openweathermap.org/api (free tier: 60 calls/min).
Set `WEATHER_API_KEY=your_key` in `.env`.

Without a key, the system uses:
1. Today's data from the database
2. Realistic demo values as fallback

This keeps the app fully functional even offline or without an API key — important for low-bandwidth environments as stated in your project requirements.

---

## 📊 Database Schema Summary

| Table            | PK         | FKs                    |
|------------------|------------|------------------------|
| ADMIN            | admin_id   | —                      |
| FARMER           | farmer_id  | —                      |
| QUERY            | query_id   | farmer_id, admin_id    |
| ADVISORY         | adv_id     | admin_id               |
| MARKET_PRICE     | price_id   | admin_id               |
| WEATHER_FORECAST | fc_id      | —                      |
