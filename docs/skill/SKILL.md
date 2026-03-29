# SKILL: SE Micro Project Report Generator
## For: Digital Farmer Assistance System — PECST411

---

## OVERVIEW

This skill instructs an AI agent to generate a **complete, well-structured, editable LaTeX report** for the Software Engineering Micro Project (Course Code: PECST411) based on the Digital Farmer Assistance System project.

**Root directory:** `/home/jithu/projects/se/` (or the project root)

**Directory layout:**
```

.
├── docs/                          ← Project documentation & report generation
│   ├── format/                    ← Report instructions & template PDFs/DOCX
│   │   ├── report_instruction.pdf
│   │   ├── report_template.pdf
│   │   ├── SE_MicroProject_Instructions.docx
│   │   └── SE_MicroProject_Report_Template.docx
│   ├── images/                    ← Project screenshots (may be empty)
│   ├── presentation/              ← Slide deck used during presentation
│   │   └── SE SLIDES.pdf
│   ├── report/                    ← OUTPUT DIRECTORY — write all .tex files here
│   └── skill/
│       └── SKILL.md               ← This file
├── setup/                         ← Database setup and initialization scripts
└── src/                           ← Source code for the web application
    ├── README.md                  ← Project documentation
    ├── server.js                  ← Express entry point
    ├── db.js                      ← MySQL connection pool
    ├── schema.sql                 ← Database schema
    ├── .env.example               ← Config template
    ├── Dockerfile                 ← Docker image definition
    ├── docker-compose.yml         ← Docker services orchestration
    ├── middleware/                ← Express middleware
    ├── routes/                    ← API route handlers
    └── public/                    ← Frontend static assets
```

---

## PHASE 0 — MANDATORY PRE-GENERATION STEPS (DO NOT SKIP)

Before writing a single line of LaTeX, the agent **must** complete every step below in order.

### Step 0.1 — Read the format documents

```
Read: docs/format/report_instruction.pdf
Read: docs/format/report_template.pdf
```

Extract and internally note:
- Every **required section** (cover page, abstract, all numbered chapters)
- **Formatting rules**: font (Times New Roman 12pt), line spacing (1.5), page length (18–25 pages)
- **Appendix requirements**: 6–10 screenshots with figure numbers and captions
- **Evaluation rubric** (15 marks breakdown) — use this to ensure every evaluated item is covered thoroughly

If the DOCX variants are also readable, cross-check them for any additional detail.

### Step 0.2 — Read the presentation slides

```
Read: docs/presentation/SE SLIDES.pdf
```

Extract and note all content that appears in the slides, including:
- Problem statement (initial and refined/modified)
- Ambiguities, inconsistencies, and incompleteness identified
- Functional and Non-Functional requirements
- SDG alignment (SDG 8 & SDG 9)
- Feasibility analysis (Technical, Economic, Operational, Schedule)
- Layered architecture design and all four layers
- Module identification per layer
- Cohesion and coupling analysis
- UML diagrams described or shown (Use Case, Class Diagram)

### Step 0.3 — Read the project README

```
Read: src/README.md
```

Extract and note:
- Project title: **Digital Farmer Assistance System**
- Full directory/file structure (server.js, db.js, schema.sql, routes/, middleware/, public/)
- All API endpoints (Auth, Market, Weather, Advisory, Queries, Farmers, Admins, Dashboard)
- Architecture mapping table (module → implementation file)
- Database schema (all 6 tables: ADMIN, FARMER, QUERY, ADVISORY, MARKET_PRICE, WEATHER_FORECAST)
- Tech stack: Node.js (v18+), Express, MySQL 8.0, JWT, bcrypt, OpenWeatherMap API
- Demo credentials and setup instructions
- Weather API fallback strategy

### Step 0.4 — Inventory the images folder

```
List: docs/images/
```

- If images exist: note their filenames; reference them in the appendix with `\includegraphics`
- If the folder is **empty**: generate placeholder blocks for every required screenshot (see placeholder specification below)

### Step 0.5 — Synthesise before writing

After reading all sources, mentally outline (or write a brief comment at the top of `main.tex`):
- What content is available for each required section
- Where you need to synthesise/expand from README + slides + SE knowledge
- Which sections need the most elaboration to hit the 18–25 page target

Only after completing Phase 0 should you proceed to writing.

---

## PHASE 1 — LaTeX PROJECT SETUP

Create the following file structure inside `docs/report/`:

```
docs/report/
├── main.tex               ← Master file; \input all chapters
├── preamble.tex           ← All \usepackage, page geometry, fonts, custom commands
├── chapters/
│   ├── 00_cover.tex
│   ├── 01_abstract.tex
│   ├── 02_introduction.tex
│   ├── 03_problem_statement.tex
│   ├── 04_requirement_analysis.tex
│   ├── 05_feasibility.tex
│   ├── 06_srs.tex
│   ├── 07_system_design.tex
│   ├── 08_uml_diagrams.tex
│   ├── 09_coding_strategy.tex
│   ├── 10_testing_strategy.tex
│   ├── 11_deployment_plan.tex
│   ├── 12_reflection.tex
│   ├── 13_references.tex
│   └── 14_appendix.tex
└── compile.sh             ← Build script
```

---

## PHASE 2 — PREAMBLE SPECIFICATION (`preamble.tex`)

```latex
% ---------- preamble.tex ----------
\usepackage[a4paper, top=2.54cm, bottom=2.54cm, left=3cm, right=2.54cm]{geometry}
% Font — choose one:
%   XeLaTeX/LuaLaTeX: \usepackage{fontspec} then \setmainfont{Times New Roman}
%   pdfLaTeX fallback: \usepackage{mathptmx}
\usepackage{mathptmx}           % Times New Roman equivalent for pdflatex
\usepackage{setspace}
\usepackage{titlesec}
\usepackage{graphicx}
\usepackage{caption}
\usepackage{subcaption}
\usepackage{float}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{array}
\usepackage{multirow}
\usepackage{hyperref}
\usepackage{xcolor}
\usepackage{listings}
\usepackage{enumitem}
\usepackage{fancyhdr}
\usepackage{tocloft}
\usepackage{amsmath}
\usepackage{tikz}
\usetikzlibrary{shapes, arrows.meta, positioning, fit, calc, backgrounds}

% Spacing
\onehalfspacing

% Section formatting
\titleformat{\chapter}[block]{\large\bfseries\centering}{Chapter \thechapter:}{1em}{}
\titleformat{\section}{\normalsize\bfseries}{\thesection}{1em}{}
\titleformat{\subsection}{\normalsize\bfseries\itshape}{\thesubsection}{1em}{}

% Header/Footer
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small Digital Farmer Assistance System}
\fancyhead[R]{\small PECST411 --- SE Micro Project}
\fancyfoot[C]{\thepage}
\renewcommand{\headrulewidth}{0.4pt}

% Listings style
\lstset{
  basicstyle=\ttfamily\small,
  breaklines=true,
  frame=single,
  captionpos=b,
  numbers=left,
  numberstyle=\tiny,
  tabsize=2
}

% Image placeholder command
% Usage: \imgplaceholder{width_cm}{height_cm}{Caption}{label_suffix}
\newcommand{\imgplaceholder}[4]{%
  \begin{figure}[H]
    \centering
    \begin{tikzpicture}
      \draw[thick, dashed, gray!60] (0,0) rectangle (#1,#2);
      \fill[gray!10] (0,0) rectangle (#1,#2);
      \node[gray!70, align=center, text width=#1 cm] at (#1/2, #2/2)
        {\small \textit{[Screenshot Placeholder]\\#3}};
    \end{tikzpicture}
    \caption{#3}
    \label{fig:#4}
  \end{figure}%
}
```

---

## PHASE 3 — CHAPTER-BY-CHAPTER CONTENT SPECIFICATION

### `00_cover.tex` — Cover Page

Use `\thispagestyle{empty}`. Layout with `\vspace` and `\begin{center}`:

```
NSS College of Engineering Palakkad
Department of Computer Science and Engineering

[blank line]

Software Engineering Micro Project Report

Course Code: PECST411
Course Name: Software Engineering
Programme: B.Tech Computer Science and Engineering
Semester: S4

[blank line]

Project Title:
Digital Farmer Assistance System

[blank line]

Team Members:
1. [Name 1]
2. [Name 2]
3. [Name 3]
4. [Name 4]
5. [Name 5]

Batch: A / B

[blank line]

Submission Date: _______________
```

Use `\LARGE\textbf` for the project title, `\large` for section labels.

---

### `01_abstract.tex` — Abstract

- **Length:** 150–200 words, single paragraph, no subsections
- Cover: problem addressed, approach, key features (market prices, weather forecasts, crop advisories, expert query resolution), tech stack, expected impact

---

### `02_introduction.tex` — Introduction

Sub-sections:

**1.1 Background**
State of Indian agriculture, the digital divide in rural areas, and why farmers lack timely access to information. Ground in context: small-scale farming, market volatility, unpredictable weather.

**1.2 Objectives**
Numbered list:
1. Provide real-time, validated crop-specific agricultural advisories
2. Deliver live market price updates from regional markets
3. Offer localized 5-day weather forecasts with extreme weather alerts
4. Enable farmers to raise queries directly to agricultural experts
5. Support multilingual access for rural users with varying digital literacy

**1.3 Scope**
- Web-based system accessible via any browser (mobile-first)
- Two user roles: Farmer and Admin (with Superadmin sub-role)
- Backend: Node.js + MySQL; Frontend: HTML/CSS/JS
- External integration: OpenWeatherMap API with DB fallback
- Multilingual DB-level support (language field in advisory)

**1.4 Report Organisation**
One sentence per chapter describing what follows.

Target length: at least 1.5 full pages.

---

### `03_problem_statement.tex` — Problem Statement

**3.1 Initial Problem Statement**
Farmers currently lack timely and reliable access to localised crop advisory, real-time market prices, and critical weather information. This information gap results in inefficient farming practices, reduced crop yields, and financial vulnerability due to market volatility and unpredictable weather patterns.

**3.2 Ambiguities, Inconsistencies, and Incompleteness Identified**

*Ambiguities:*
- "Timely access" is undefined — does it mean real-time, hourly, or daily updates?
- "Market prices" does not specify geographical range — local mandis vs. national markets

*Inconsistencies:*
- No mention of how data is sourced or validated (data integrity)
- Missing details on offline functionality for intermittent connectivity
- No specific user authentication protocols stated for data privacy

*Incompleteness:*
- "Weather alerts" not clarified as automated or manually pushed by admins
- Tension between "low-bandwidth requirements" and "web/mobile-based access" not resolved

**3.3 Refined Problem Statement**
To design and develop a Digital Farmer Assistance System that centralises agricultural data to provide:
- Real-time synchronisation of regional market prices and weather forecasts
- Validated, season-specific crop advisories through a multilingual interface

Goal: To eliminate information asymmetry, allowing farmers to make data-driven decisions that enhance productivity and financial sustainability in a low-bandwidth environment.

---

### `04_requirement_analysis.tex` — Requirement Analysis

**4.1 Functional Requirements**

Use `\begin{longtable}` with columns: Req ID | Description | Priority

| FR ID | Description | Priority |
|-------|-------------|----------|
| FR1 | User Management: farmers register, create profiles, and select preferred crops and regions | High |
| FR2 | Advisory Engine: provide crop-specific guidance based on current growth stage and season | High |
| FR3 | Information Retrieval: display daily updated market prices and localized 5-day weather forecasts | High |
| FR4 | Alert System: push automated notifications for extreme weather warnings | High |
| FR5 | Admin Control: dashboard for administrators to update prices and advisory content | High |
| FR6 | Interaction Module: feedback/query module for farmers to interact with agricultural experts | Medium |

**4.2 Non-Functional Requirements**

| NFR ID | Category | Description |
|--------|----------|-------------|
| NFR1 | Performance | Load essential text data within 2 seconds on 2G/low-bandwidth connections |
| NFR2 | Availability | 99.9% uptime (24/7 availability) |
| NFR3 | Usability | Mobile-First design with high-contrast icons for varying digital literacy |
| NFR4 | Accessibility | Support at least three regional languages in addition to English |
| NFR5 | Scalability | Support 20% concurrent user increase annually without performance degradation |
| NFR6 | Security | All user data encrypted; accessible only through secure logins (JWT + bcrypt) |

**4.3 SDG Alignment**

Sub-section with a paragraph each:
- **SDG 8 – Decent Work and Economic Growth:** Market price access increases income potential of small-scale farmers by enabling direct access to market trends.
- **SDG 9 – Industry, Innovation, and Infrastructure:** The platform utilises digital infrastructure to modernise traditional agricultural practices and enhance rural connectivity.

---

### `05_feasibility.tex` — Feasibility Study

**5.1 Technical Feasibility**
- System implementable using mature web technologies (Node.js, Express, MySQL)
- Third-party APIs (OpenWeatherMap) accessible via free tier (60 calls/min)
- Multilingual support implemented at DB level via `language` field in ADVISORY table
- JWT authentication and bcrypt password hashing via standard Node.js libraries
- No hardware integration or advanced AI required — complexity remains manageable
- DB fallback mechanism ensures functionality even without live API access

**5.2 Economic Feasibility**
- All tools open-source (Node.js, MySQL, Express) — zero licensing cost
- Cloud hosting (Railway, Render, Fly.io) available at minimal or no cost for prototyping
- Farmers require only basic smartphones or computers with internet access
- Benefits: improved crop yield decisions, better market timing, reduced financial losses
- ROI justifies development and maintenance costs

**5.3 Operational Feasibility**
- Simple, mobile-first UI designed for rural users with varying digital literacy
- Role-based access: Farmers interact with advisory/market/weather; Admins manage content
- Admin CRUD operations are straightforward and require minimal training
- Minimal onboarding required for farmer registration (phone number + password)

**5.4 Schedule Feasibility**
- Project is completable within the academic semester (S4) timeframe
- Modular structure (routes/auth, routes/market, routes/weather, routes/advisory) allows parallel development
- Independent testing of each module is possible without full system integration
- Future extensibility does not require rearchitecting

**Conclusion:** The Digital Farmer Assistance System is technically, economically, operationally, and schedule feasible.

---

### `06_srs.tex` — Software Requirement Specification (SRS)

**6.1 System Overview**
A web-based platform delivering agricultural support to farmers through three core services: crop advisory, market pricing, and weather forecasting. Administered by a content management team via a dedicated admin panel.

**6.2 System Features**
Describe each feature (FR1–FR6) in a numbered list with 2–3 sentences each.

**6.3 External Interface Requirements**

- *User Interfaces:* Responsive HTML/CSS/JavaScript frontend; mobile-first layout; high-contrast iconography
- *Hardware Interfaces:* Any device with a modern web browser (smartphone, tablet, PC)
- *Software Interfaces:* OpenWeatherMap REST API (JSON); MySQL 8.0 database; Node.js v18+ runtime
- *Communication Interfaces:* HTTPS; JWT Bearer tokens in the `Authorization` header for protected routes

**6.4 Assumptions**
1. Users have intermittent internet access (DB fallback covers offline weather)
2. Node.js v18+ and MySQL 8.0+ are available on the deployment server
3. At least one admin user is seeded in the database at deployment
4. Weather API key is optional; demo/DB fallback mode is always available

**6.5 Constraints**
1. System is web-only (no native mobile app in current scope)
2. Market price data is manually entered by admins (no live market API in current scope)
3. SMS/push notification backend is marked as future scope (currently app-level alerts only)
4. Language support limited to what is seeded in the advisory content

---

### `07_system_design.tex` — System Design

**7.1 Architectural Overview**
The system adopts a **four-layer architecture** providing clear separation of concerns. [Write 1 paragraph explaining the rationale for layered architecture.]

**7.2 Architecture Diagram (TikZ)**

Draw four stacked labelled boxes with arrows indicating data flow top-to-bottom and bottom-to-top:

```tikz
\begin{tikzpicture}[
  layer/.style={draw, thick, rounded corners, fill=green!8,
                minimum width=12cm, minimum height=1.4cm, align=center},
  arr/.style={-Stealth, thick, gray}
]
\node[layer] (ui)   at (0, 6)   {\textbf{Presentation Layer (UI)}\\
                                  Web/Mobile Interface $|$ Multilingual Support $|$ User Profiles};
\node[layer] (bll)  at (0, 4)   {\textbf{Business Logic Layer}\\
                                  Crop Advisory Logic $|$ Weather Alerts $|$ Market Price Processing};
\node[layer] (int)  at (0, 2)   {\textbf{Integration Layer}\\
                                  Third-Party APIs (OWM, Market) $|$ Authentication Services};
\node[layer] (dal)  at (0, 0)   {\textbf{Data Access Layer (Persistence)}\\
                                  MySQL Database $|$ Static Content Storage};
\draw[arr] (ui)  -- (bll);
\draw[arr] (bll) -- (int);
\draw[arr] (int) -- (dal);
\draw[arr, bend right=45] (dal.east) to (ui.east);
\end{tikzpicture}
```

**7.3 Module Design**

Present as a table then describe each module in 2–3 sentences:

| Layer | Module | Implementation File |
|-------|--------|---------------------|
| Presentation | User Interface Module | `public/index.html` |
| Presentation | Multilingual Support Module | DB `language` field + farmer preference |
| Business Logic | User Management Module | `routes/auth.js`, `middleware/auth.js` |
| Business Logic | Advisory Engine Module | `routes/advisory.js` |
| Business Logic | Alert Manager Module | `is_extreme` flag in WEATHER_FORECAST, `routes/weather.js` |
| Integration | Market Price Integration Module | `routes/market.js` |
| Integration | Weather Service Module | `routes/weather.js` (OWM API → DB → mock) |
| Data Access | Data Persistence Module | `db.js` (mysql2 pool) |
| Data Access | Content Management Module | Admin CRUD via all route files |

**7.4 Database Schema**

| Table | Primary Key | Foreign Keys | Notable Columns |
|-------|-------------|--------------|-----------------|
| ADMIN | admin_id | — | name, email, role, password\_hash |
| FARMER | farmer_id | — | name, phone, crops, region, language\_pref |
| QUERY | query\_id | farmer\_id, admin\_id | subject, description, status, response |
| ADVISORY | adv\_id | admin\_id | crop\_type, season, language, content |
| MARKET\_PRICE | price\_id | admin\_id | crop\_name, price, source\_market, date |
| WEATHER\_FORECAST | fc\_id | — | location, temp, condition, is\_extreme, date |

**7.5 Cohesion Analysis**
Each module performs a single well-defined function (functional cohesion — highest form).
- User Management: authentication and profiles only
- Advisory Engine: advisory filtering and retrieval only
- Weather/Alert Module: weather data and alert logic only

Benefits: easier maintenance, improved readability, modules independently replaceable.

**7.6 Coupling Analysis**
The system follows low coupling (data coupling) via the layered architecture.
- UI interacts only with the Business Logic Layer — not directly with the DB
- Business Logic accesses external data only through the Integration Layer
- Changes in third-party APIs affect only the Integration Layer

Benefits: reduced cross-module impact, enhanced scalability, supports future microservices migration.

**7.7 Design Justification**
- **Scalability:** Layered approach enables future migration to microservices or cloud XaaS
- **Maintainability:** Corrective and perfective maintenance is localised to individual layers
- **Reliability:** Decoupling data fetching from display means slow external APIs do not freeze the UI

---

### `08_uml_diagrams.tex` — UML Diagrams

**8.1 Use Case Diagram**

If `docs/images/use_case.png` exists: `\includegraphics`. Otherwise use `\imgplaceholder`.

Below the diagram, provide a written description:

*Actors:* Farmer, Admin

*Farmer Use Cases:*
- View Market Prices (<<include>> Secure Login)
- View Weather Information (<<include>> Secure Login)
- View Crop Advisory (<<include>> Secure Login)
- Submit Query (<<include>> Secure Login)
- Manage Profile (<<include>> Secure Login)

*Admin Use Cases:*
- Manage Users
- Respond to Queries
- Manage Advisory Database
- Manage Market Prices
- Manage Weather Data

**8.2 Class Diagram**

If `docs/images/class_diagram.png` exists: `\includegraphics`. Otherwise use `\imgplaceholder`.

Below the diagram, describe each class and its relationships:

*Classes (from design):*
- `User` (abstract base): userID, name, password; login(), logout()
- `Admin` extends User: adminRole; createAdvisory(), updateMarketPrice(), respondToQuery()
- `Farmer` extends User: region, preferredCrops; viewAdvisory(), checkMarketPrice(), getWeatherForecast()
- `Advisory`: advisoryID, cropType, season, content, lastUpdated; getAdvisoryDetails()
- `Query`: queryID, farmerID, subject, description, status; submitQuery(), updateStatus()
- `UserProfile`: languagePreference, phoneNumber; updateProfile(), getProfile()
- `MarketPrice`: priceID, cropName, currentPrice, sourceMarket, dateUpdated; fetchLatestPrice()
- `WeatherForecast`: location, temperature, weatherCondition, forecastDate; fetchWeatherData()
- `Alert`: alertID, alertType, message, timestamp; sendAlert()

*Key Relationships:*
- Admin, Farmer ← User (inheritance)
- Farmer ◆→ UserProfile (composition)
- Farmer --→ MarketPrice, WeatherForecast (dependency)
- WeatherForecast --→ Alert (dependency)
- Admin creates Advisory; Farmer submits Query; Admin responds to Query

---

### `09_coding_strategy.tex` — Coding Strategy

**9.1 Language and Runtime**
- Backend: JavaScript (Node.js v18+) — asynchronous, event-driven, suitable for I/O-heavy workloads
- Frontend: HTML5, CSS3, Vanilla JavaScript (ES6+) — no build step required, low-bandwidth friendly
- Database: MySQL 8.0, standard SQL

**9.2 Frameworks and Libraries**

| Library | Purpose |
|---------|---------|
| Express.js | HTTP server, routing, middleware pipeline |
| mysql2 | MySQL connection pool (async/await support) |
| bcrypt | Password hashing (salt rounds: 10) |
| jsonwebtoken | JWT generation and verification |
| dotenv | Environment variable management |
| cors | Cross-Origin Resource Sharing headers |

**9.3 Project Structure**
Reproduce the full directory tree from README using a `lstlisting` or `verbatim` block.

**9.4 Coding Standards**
- RESTful API design: GET (read), POST (create), PUT (update), DELETE (remove)
- Separation of concerns: route handlers → middleware → DB pool
- All secrets (DB password, JWT secret, API key) via environment variables (`.env`)
- Async/await with try-catch for all asynchronous operations
- Parameterised SQL queries to prevent SQL injection
- Role-based access control enforced at middleware level (`auth.js`)

**9.5 Version Control**
- Git recommended; `.env` excluded via `.gitignore`
- `.env.example` committed to document required configuration keys

**9.6 Representative Code Sample**
Include a short `lstlisting` block (10–15 lines) showing the farmer login route or the weather GET handler, demonstrating parameterised queries, JWT signing, and error handling.

---

### `10_testing_strategy.tex` — Testing Strategy

**10.1 Testing Approach**
Three levels:
1. Unit testing — individual route handlers and utility functions
2. Integration testing — API endpoint ↔ database ↔ external weather API
3. System/UI testing — full user journey on mobile viewport (Chrome DevTools Device Mode)

**10.2 Functional Test Cases**

Use `\begin{longtable}` with columns: TC ID | Module | Input | Expected Output | Status

Include all of the following (expand in the actual file):

| TC ID | Module | Input | Expected Output | Status |
|-------|--------|-------|-----------------|--------|
| TC01 | Auth | Valid farmer phone + password via POST /api/auth/farmer/login | HTTP 200, JWT token returned | Pass |
| TC02 | Auth | Invalid credentials | HTTP 401 Unauthorized | Pass |
| TC03 | Auth | Admin email + password via POST /api/auth/admin/login | HTTP 200, JWT with admin role | Pass |
| TC04 | Market | GET /api/market (no token required) | HTTP 200, JSON array of price records | Pass |
| TC05 | Market | GET /api/market?crop=Rice | HTTP 200, filtered results for Rice | Pass |
| TC06 | Market | POST /api/market with valid admin JWT | HTTP 201, new price record created | Pass |
| TC07 | Market | POST /api/market with farmer JWT | HTTP 403 Forbidden | Pass |
| TC08 | Weather | GET /api/weather?locations=Palakkad | HTTP 200, weather data for Palakkad | Pass |
| TC09 | Weather | GET /api/weather/alerts | HTTP 200, list of is\_extreme locations | Pass |
| TC10 | Advisory | GET /api/advisory?crop=Rice\&season=Kharif | HTTP 200, filtered advisories | Pass |
| TC11 | Advisory | GET /api/advisory/for-farmer (farmer JWT) | HTTP 200, advisories for farmer's crops | Pass |
| TC12 | Queries | POST /api/queries (farmer JWT) | HTTP 201, query record created | Pass |
| TC13 | Queries | PUT /api/queries/:id/respond (admin JWT) | HTTP 200, expert response saved | Pass |
| TC14 | Farmers | GET /api/farmers/me (farmer JWT) | HTTP 200, farmer profile returned | Pass |
| TC15 | Stats | GET /api/stats (any valid JWT) | HTTP 200, dashboard counts + alert list | Pass |

**10.3 Boundary and Negative Test Cases**

| TC ID | Scenario | Input | Expected |
|-------|----------|-------|----------|
| TC16 | Missing JWT | Request to protected route without token | HTTP 401 |
| TC17 | API unavailable | Weather fetch with invalid/missing API key | DB fallback data returned, HTTP 200 |
| TC18 | Invalid route | GET /api/nonexistent | HTTP 404 |
| TC19 | Duplicate registration | POST /api/auth/farmer/register with existing phone | HTTP 409 Conflict |
| TC20 | Role escalation | Farmer attempts to POST /api/admins | HTTP 403 Forbidden |

---

### `11_deployment_plan.tex` — Deployment Plan

**11.1 Deployment Environment**
- OS: Linux (Ubuntu 22.04 LTS recommended)
- Runtime: Node.js v18+
- Database: MySQL 8.0 (local instance or managed cloud DB)
- Web Server: Express.js built-in (serves static files from `public/`)
- Optional: Nginx as reverse proxy for production (SSL termination, port forwarding)

**11.2 Local Deployment Steps**
Numbered list from README:
1. Install Node.js v18+ and MySQL 8.0
2. Navigate to project directory; run `npm install`
3. Copy `.env.example` to `.env`; configure `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `WEATHER_API_KEY`, `PORT`
4. Initialise database: `mysql -u root -p < schema.sql`
5. Start server: `node server.js`
6. Open browser at `http://localhost:3000`

**11.3 Cloud Deployment**
- Platform options: Railway.app, Render.com, Fly.io (all support Node.js + MySQL)
- Secrets configured via platform dashboard environment variable settings
- Database: managed MySQL on PlanetScale, Railway, or AWS RDS Free Tier

**11.4 Maintenance**
- Weather API key rotation (OWM free tier: 60 calls/min limit)
- Scheduled database backups via `mysqldump`
- Log monitoring via server console or a lightweight logger (e.g., morgan)
- JWT secret rotation: update `JWT_SECRET` in environment and redeploy; existing tokens will be invalidated

---

### `12_reflection.tex` — Reflection and Learning Outcomes

**12.1 Challenges Faced**
- Resolving ambiguities in the initial problem statement (defining "timely access", geographic scope)
- Balancing real-time API data with a reliable offline/low-bandwidth fallback mechanism
- Designing role-based access (farmer vs. admin vs. superadmin) that is secure yet simple
- Implementing multilingual content at the database level rather than the application layer
- Designing a mobile-first UI that serves users with low digital literacy

**12.2 Client Interaction and Requirement Elicitation**
Discuss how initial requirements were vague and how the team iterated to produce the refined problem statement. Highlight the importance of identifying ambiguities before coding begins.

**12.3 Lessons Learned**
- Early requirements clarification prevents costly rework
- Layered architecture enforces separation of concerns and simplifies unit testing
- Parameterised SQL queries are non-negotiable for security
- DB fallback patterns are essential for rural/low-connectivity deployment
- UML diagrams served as a communication tool across the team

**12.4 Learning Outcomes (mapped to course objectives)**
- Applied all major SDLC phases: requirements → design → coding → testing → deployment
- Practised formal SRS writing and multi-dimension feasibility analysis
- Gained hands-on experience with REST API design, JWT authentication, and MySQL
- Understood cohesion and coupling principles in a real full-stack system context
- Appreciated the role of design patterns (layered architecture) in large projects

---

### `13_references.tex` — References

Use `\begin{thebibliography}{99}` format:

1. Pressman, R.S. and Maxim, B.R., *Software Engineering: A Practitioner's Approach*, 9th ed., McGraw-Hill Education, 2020.
2. Sommerville, I., *Software Engineering*, 10th ed., Pearson Education, 2016.
3. OpenWeatherMap, "API Documentation," openweathermap.org/api. [Online]. Accessed: 2024.
4. OpenJS Foundation, "Express.js Documentation," expressjs.com. [Online]. Accessed: 2024.
5. Oracle Corporation, "MySQL 8.0 Reference Manual," dev.mysql.com/doc. [Online]. Accessed: 2024.
6. Auth0, "Introduction to JSON Web Tokens," jwt.io/introduction. [Online]. Accessed: 2024.
7. United Nations, "Sustainable Development Goals," sdgs.un.org/goals. [Online]. Accessed: 2024.
8. Fowler, M., *Patterns of Enterprise Application Architecture*, Addison-Wesley, 2002.

---

### `14_appendix.tex` — Appendix A: Product Screenshots (MANDATORY)

**Agent instruction:** Check `docs/images/` first.
- If an image file is found for a given screen (e.g., `docs/images/login.png`): use `\includegraphics[width=0.85\textwidth]{../../images/login.png}` inside a `figure` environment with `\caption` and `\label`.
- If no image exists: use the `\imgplaceholder` macro.

Required screenshots — generate one block per item below:

1. **System Home Page** — Landing screen showing market prices, weather summary, and navigation menu
2. **Farmer Login Interface** — Phone number and password authentication form
3. **Admin Login Interface** — Email and password form for administrator access
4. **Farmer Dashboard** — Crop advisories, weather forecast, and market price summary cards
5. **Market Prices Module** — Searchable/filterable table of crop prices with date and source market
6. **Weather Module** — 5-day localized weather forecast with extreme weather alert indicators
7. **Crop Advisory Module** — Season and crop-filtered advisory cards with multilingual label
8. **Query Submission Form** — Farmer query form for submitting agricultural questions to experts
9. **Admin Panel** — CRUD interface for managing advisories, market prices, and weather data
10. **Database Schema View** — ER view or CLI output showing the six tables and their relationships

Each figure must have:
- `\caption{<descriptive text>}`
- `\label{fig:<short_id>}`
- A short paragraph below the figure (1–2 sentences) describing what the screenshot demonstrates

---

## PHASE 4 — `main.tex` MASTER FILE

```latex
\documentclass[12pt, a4paper]{report}
\input{preamble}

\begin{document}

%% Cover Page (no page number)
\input{chapters/00_cover}
\cleardoublepage

%% Front Matter
\tableofcontents
\newpage
\listoffigures
\newpage
\listoftables
\newpage

%% Abstract
\chapter*{Abstract}
\addcontentsline{toc}{chapter}{Abstract}
\input{chapters/01_abstract}
\newpage

%% Main Chapters
\chapter{Introduction}
\input{chapters/02_introduction}

\chapter{Problem Statement}
\input{chapters/03_problem_statement}

\chapter{Requirement Analysis}
\input{chapters/04_requirement_analysis}

\chapter{Feasibility Study}
\input{chapters/05_feasibility}

\chapter{Software Requirement Specification (SRS)}
\input{chapters/06_srs}

\chapter{System Design}
\input{chapters/07_system_design}

\chapter{UML Diagrams}
\input{chapters/08_uml_diagrams}

\chapter{Coding Strategy}
\input{chapters/09_coding_strategy}

\chapter{Testing Strategy}
\input{chapters/10_testing_strategy}

\chapter{Deployment Plan}
\input{chapters/11_deployment_plan}

\chapter{Reflection and Learning Outcomes}
\input{chapters/12_reflection}

%% References
\chapter*{References}
\addcontentsline{toc}{chapter}{References}
\input{chapters/13_references}

%% Appendix
\appendix
\chapter{Product Screenshots}
\input{chapters/14_appendix}

\end{document}
```

---

## PHASE 5 — QUALITY CHECKLIST

Before delivering files, verify every item:

| # | Requirement | Target |
|---|-------------|--------|
| 1 | Page count | 18–25 pages when compiled |
| 2 | Font | Times New Roman 12pt (mathptmx or fontspec) |
| 3 | Spacing | `\onehalfspacing` applied |
| 4 | Cover page | Matches report\_template exactly |
| 5 | Abstract | 150–200 words |
| 6 | All 13 required sections | Present with substantive content |
| 7 | All figures | Have `\caption` and `\label` |
| 8 | All tables | Have `\caption` and use `booktabs` |
| 9 | Use Case Diagram | Present (TikZ or image or placeholder) |
| 10 | Class Diagram | Present (TikZ or image or placeholder) |
| 11 | Test cases table | ≥ 15 test cases |
| 12 | Appendix screenshots | 6–10 items (real or placeholder) |
| 13 | Each screenshot | Has figure number and short caption |
| 14 | References | ≥ 5 references |
| 15 | Evaluation rubric items | All 7 items addressed in content |
| 16 | No DBMS mention | Report is strictly SE scope |
| 17 | Compiles | Zero LaTeX errors on first pass |

---

## PHASE 6 — `compile.sh`

```bash
#!/bin/bash
# Run from docs/report/
set -e
echo "Compiling SE Micro Project Report..."
pdflatex -interaction=nonstopmode main.tex
pdflatex -interaction=nonstopmode main.tex   # second pass: TOC, labels
echo "Done. Output: docs/report/main.pdf"
```

If using BibTeX for references:
```bash
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

---

## AGENT EXECUTION ORDER SUMMARY

```
STEP  ACTION
────  ──────────────────────────────────────────────────────────
 1    Read docs/format/report_instruction.pdf
 2    Read docs/format/report_template.pdf
 3    Read docs/presentation/SE SLIDES.pdf
 4    Read src/README.md (project root)
 5    List docs/images/ — note available screenshots
 6    Create docs/report/preamble.tex
 7    Create docs/report/main.tex
 8    Create docs/report/chapters/00_cover.tex
 9    Create docs/report/chapters/01_abstract.tex
10    Create docs/report/chapters/02_introduction.tex
11    Create docs/report/chapters/03_problem_statement.tex
12    Create docs/report/chapters/04_requirement_analysis.tex
13    Create docs/report/chapters/05_feasibility.tex
14    Create docs/report/chapters/06_srs.tex
15    Create docs/report/chapters/07_system_design.tex   ← TikZ architecture diagram
16    Create docs/report/chapters/08_uml_diagrams.tex    ← TikZ/placeholder UML
17    Create docs/report/chapters/09_coding_strategy.tex
18    Create docs/report/chapters/10_testing_strategy.tex
19    Create docs/report/chapters/11_deployment_plan.tex
20    Create docs/report/chapters/12_reflection.tex
21    Create docs/report/chapters/13_references.tex
22    Create docs/report/chapters/14_appendix.tex        ← real images OR placeholders
23    Create docs/report/compile.sh  (chmod +x)
24    Run quality checklist (Phase 5)
25    Attempt compilation if LaTeX is available; report errors
```

---

## CRITICAL AGENT REMINDERS

1. **Never skip Phase 0.** Content quality depends on thoroughly reading all four source documents before writing a single line of LaTeX.

2. **Do not mention DBMS anywhere in the report.** This is strictly an SE micro project.

3. **Team member names** are unknown — leave as `[Name 1]` through `[Name 5]` and submission date as `\underline{\hspace{6cm}}`.

4. **Placeholders must be descriptive.** The caption inside `\imgplaceholder` must clearly name what screenshot goes there so a human can substitute it later.

5. **TikZ for diagrams.** Use TikZ for the architecture diagram and, where possible, for UML — they compile without external image files and are fully editable.

6. **Hit the page target.** The 18–25 page requirement means prose sections (Introduction, SRS, System Design, Testing, Reflection) need full academic paragraphs, not just bullet points.

7. **Academic register.** Write in third person. Use formal English. No colloquialisms.

8. **booktabs for all tables.** Use `\toprule`, `\midrule`, `\bottomrule` — never `\hline`.

9. **Use `longtable`** for test cases and requirement tables that may span multiple pages.

10. **Evaluation rubric is your north star.** Every one of the seven evaluated items must have a clearly identifiable section in the report:
    - Problem Statement Quality → Chapter 3
    - Requirement Analysis & Refinement → Chapter 4
    - Feasibility Study → Chapter 5
    - Design & Patterns with Justification → Chapter 7 (sections 7.1, 7.3, 7.5–7.7)
    - UML Diagrams → Chapter 8
    - Testing Strategy & Test Case Design → Chapter 10
    - Final Compiled Report & Reflection → Chapter 12 + overall quality
