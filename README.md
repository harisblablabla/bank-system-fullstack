# Belimbing Bank Saving System - Overview

## 📋 System Purpose

A **bank management system** for handling customer accounts, deposito types, and transactions with automatic compound interest calculation. Designed as an **MVP/Interview Demo** project showcasing full-stack development with production-grade architecture.

---

## 👤 User

**Single-User System** - Bank Officer Workstation
- No authentication/login required
- All features accessible to the operator

**Future Enhancement**: Multi-user with authentication and role-based access control

---

## 🎯 Core Features

### 1. Customer Management
- Create, view, edit, and delete customers
- Track number of accounts per customer
- Cascade deletion (deletes all accounts and transactions)

### 2. Deposito Type Management
- Define interest rate packages (e.g., Bronze 3%, Silver 5%, Gold 7%)
- Monthly interest calculated automatically (yearly ÷ 12)
- Prevent deletion of types currently in use

### 3. Account Management
- Open accounts for customers with selected deposito type
- Each account has:
  - Package name
  - Associated customer
  - Deposito type (interest rate)
  - Current balance
- Edit account package or deposito type
- Close accounts (cascade deletes transactions)

### 4. Transaction Processing
**Deposits:**
- Add money to account
- Record transaction date
- Update balance immediately

**Withdrawals:**
- Deduct money from account
- **Automatic interest calculation** based on:
  - Time since last deposit
  - Deposito type interest rate
  - Compound interest formula: `balance × (1 + monthly_rate)^months`
- Display interest earned and new balance
- Prevent overdrafts (insufficient balance validation)

### 5. Dashboard
- Total customers count
- Total accounts count
- Total system balance
- Recent transactions
- Quick statistics

---

## 🔢 Interest Calculation Logic

### Formula
```
ending_balance = starting_balance × (1 + monthly_return)^months_held
```

### Example
```
Scenario:
- Customer deposits Rp 1,000,000 on Jan 1
- Deposito type: Silver (5% yearly)
- Withdraws Rp 500,000 on July 1 (6 months later)

Calculation:
- Monthly rate = 5% / 12 = 0.4167%
- Months held = 6
- Ending balance = 1,000,000 × (1.004167)^6 = 1,025,315.65
- Interest earned = 25,315.65
- Balance after withdrawal = 1,025,315.65 - 500,000 = 525,315.65
```

### Key Points
1. Interest calculated **only on withdrawals**
2. Based on **last deposit date** to withdrawal date
3. Uses **compound interest**, not simple interest
4. Zero interest if no deposits made (monthsHeld = 0)

---

## 🏗️ Architecture

### Frontend (Next.js 14)
**MVC Pattern:**
- **Model**: TypeScript interfaces (`lib/types.ts`)
- **View**: Client Components (`_components/*.tsx`)
- **Controller**: Server Components (`page.tsx`)

### Backend (NestJS)
**MVC Pattern:**
- **Model**: TypeORM Entities (`*.entity.ts`)
- **View**: JSON API Responses
- **Controller**: HTTP Controllers (`*.controller.ts`)
- **Service**: Business Logic (`*.service.ts`)

### Database (PostgreSQL)
- 4 main tables: `customers`, `deposito_types`, `accounts`, `transactions`
- UUID primary keys
- Proper foreign key constraints (CASCADE/RESTRICT)
- Indexed for performance

---

## 🚀 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14 (App Router) | Server-side rendering, routing |
| Frontend Language | TypeScript (Strict) | Type safety |
| Frontend Styling | Tailwind CSS | Modern, responsive UI |
| Backend Framework | NestJS 10 | Enterprise-grade Node.js framework |
| Backend Language | TypeScript (Strict) | Type safety |
| Database | PostgreSQL 14+ | Relational database |
| ORM | TypeORM | Database abstraction |
| API Documentation | Swagger | Interactive API docs |
| Process Manager | PM2 | Production process management |
| Web Server | Nginx | Reverse proxy |
| Cloud Infrastructure | AWS EC2 + RDS | Scalable cloud deployment |

---

## 📊 System Limitations

### What's NOT Included:
1. ❌ **User Authentication** - No login system
2. ❌ **Multi-user Support** - Single operator only
3. ❌ **User Roles/Permissions** - Everyone has full access
4. ❌ **Audit Trail** - No "who did what" logging
5. ❌ **Advanced Reports** - Only basic dashboard
7. ❌ **Account Statements** - No PDF generation
8. ❌ **Multiple Deposits Tracking** - Uses last deposit only for interest

### Future Enhancements:
- JWT authentication with role-based access
- Detailed audit logs
- Advanced reporting and analytics
- PDF statement generation
- Email notifications for transactions
- Track each deposit separately for precise interest
- Mobile app support
- Real-time notifications

---

## 📁 Project Structure

```
project-root/
├── README.md
├── backend-bank-saving/       # NestJS Backend API
│   ├── src/
│   │   ├── modules/           # Feature modules (MVC)
│   │   ├── common/            # Shared utilities
│   │   └── config/            # Configuration files
│   └── package.json
│
├── frontend-bank-saving/      # Next.js Frontend
│   ├── src/
│   │   ├── app/               # Pages (Controllers + Views)
│   │   ├── components/        # Reusable UI components
│   │   └── lib/               # Utilities & Models
│   └── package.json
│
└── docs/                      # Documentation
    ├── SYSTEM_SPECIFICATION.md
    ├── UML.md
    ├── ERROR_HANDLING_EDGE_CASES.md
    ├── Belimbing_Bank_Saving_System.postman_collection.json
    ├── Local_Belimbing_Bank_Saving_System.postman_environment.json
    └── Production_Belimbing_Bank_Saving_System.postman_environment.json
```

---

## 🔗 Quick Links

- **Backend API**: `http://localhost:3000/api`
- **Swagger Docs**: `http://localhost:3000/api/docs`
- **Frontend**: `http://localhost:3001`
- **Production**: `http://56.68.58.194/api`

**End of Project Overview**