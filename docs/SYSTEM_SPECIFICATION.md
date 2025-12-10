# Belimbing Bank Saving System - System Specification Document

**Version:** 1.0  
**Date:** December 2025 
**Status:** Production Ready

---

## 1. Database Design

### 1.1 Entity Relationship Diagram (ERD)

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│     customers       │         │      accounts       │         │   deposito_types    │
├─────────────────────┤         ├─────────────────────┤         ├─────────────────────┤
│ id (PK)            │◄────┐   │ id (PK)            │         │ id (PK)            │
│ name               │     │   │ packet             │         │ name               │
│ created_at         │     └───┤ customer_id (FK)   │         │ yearly_return      │
│ updated_at         │         │ deposito_type_id(FK)├────────►│ created_at         │
└─────────────────────┘         │ balance            │         │ updated_at         │
                                │ created_at         │         └─────────────────────┘
                                │ updated_at         │
                                └──────────┬──────────┘
                                           │
                                           │ 1:N
                                           │
                                           ▼
                                ┌─────────────────────┐
                                │    transactions     │
                                ├─────────────────────┤
                                │ id (PK)            │
                                │ account_id (FK)    │
                                │ type (ENUM)        │
                                │ amount             │
                                │ transaction_date   │
                                │ balance_before     │
                                │ balance_after      │
                                │ months_held        │
                                │ interest_earned    │
                                │ created_at         │
                                └─────────────────────┘
```

### 1.2 Table Specifications

#### Table: `customers`
| Column     | Type      | Constraints | Description |
|------------|-----------|-------------|-------------|
| id         | UUID | PRIMARY KEY | Unique identifier |
| name       | VARCHAR(255) | NOT NULL | Customer full name |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_customers_name` on `name`

**Relationships:**
- One-to-Many with `accounts`

-------------------------

#### Table: `deposito_types`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Deposito type name |
| yearly_return | DECIMAL(5,2) | NOT NULL, CHECK (0-100) | Yearly interest rate (%) |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_deposito_types_name` on `name`

**Relationships:**
- One-to-Many with `accounts`

**Sample Data:**
- Deposito Bronze: 3.00%
- Deposito Silver: 5.00%
- Deposito Gold: 7.00%

-------------------------

#### Table: `accounts`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| packet | VARCHAR(100) | NOT NULL | Account package name |
| customer_id | UUID | NOT NULL, FK | Reference to customers |
| deposito_type_id | UUID | NOT NULL, FK | Reference to deposito_types |
| balance | DECIMAL(15,2) | DEFAULT 0, CHECK (≥0) | Current account balance |
| created_at | TIMESTAMP | DEFAULT NOW() | Account opening date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_accounts_customer_id` on `customer_id`
- `idx_accounts_deposito_type_id` on `deposito_type_id`
- `idx_accounts_created_at` on `created_at DESC`

**Foreign Keys:**
- `customer_id` → `customers(id)` ON DELETE CASCADE
- `deposito_type_id` → `deposito_types(id)` ON DELETE RESTRICT

**Relationships:**
- Many-to-One with `customers`
- Many-to-One with `deposito_types`
- One-to-Many with `transactions`

-------------------------

#### Table: `transactions`
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| account_id | UUID | NOT NULL, FK | Reference to accounts |
| type | ENUM | NOT NULL | 'DEPOSIT' or 'WITHDRAWAL' |
| amount | DECIMAL(15,2) | NOT NULL, CHECK (>0) | Transaction amount |
| transaction_date | TIMESTAMP | NOT NULL | When transaction occurred |
| balance_before | DECIMAL(15,2) | NOT NULL | Balance before transaction |
| balance_after | DECIMAL(15,2) | NOT NULL | Balance after transaction |
| months_held | INTEGER | DEFAULT 0 | Months money was held |
| interest_earned | DECIMAL(15,2) | DEFAULT 0 | Interest earned (withdrawals) |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |

**Indexes:**
- `idx_transactions_account_id` on `account_id`
- `idx_transactions_type` on `type`
- `idx_transactions_date` on `transaction_date DESC`
- `idx_transactions_created_at` on `created_at DESC`

**Foreign Keys:**
- `account_id` → `accounts(id)` ON DELETE CASCADE

**Relationships:**
- Many-to-One with `accounts`

-------------------------

### 1.3 Database Design Decisions

1. **UUID Primary Keys**: Enhanced security, better for distributed systems
2. **DECIMAL for Money**: Avoids floating-point precision errors
3. **Cascade Deletes**: Maintains referential integrity (Customer → Accounts → Transactions)
4. **Restrict Delete**: Prevents deletion of deposito types in use
5. **Audit Fields**: All tables have `created_at` and `updated_at` timestamps
6. **Indexing Strategy**: Foreign keys and frequently queried columns are indexed

-----------------------------------------------------------

## 2. APIs Needed

### 2.1 API Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `http://56.68.58.194/api`

### 2.2 API Endpoints Summary

#### Customers API (5 endpoints)
- `GET /customers` - List all customers
- `GET /customers/:id` - Get customer details
- `POST /customers` - Create customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

#### Deposito Types API (5 endpoints)
- `GET /deposito-types` - List all deposito types
- `GET /deposito-types/:id` - Get deposito type details
- `POST /deposito-types` - Create deposito type
- `PUT /deposito-types/:id` - Update deposito type
- `DELETE /deposito-types/:id` - Delete deposito type

#### Accounts API (5 endpoints)
- `GET /accounts?customerId={id}` - List all accounts (with optional filter)
- `GET /accounts/:id` - Get account details
- `POST /accounts` - Create account
- `PUT /accounts/:id` - Update account
- `DELETE /accounts/:id` - Delete account

#### Transactions API (4 endpoints)
- `GET /transactions?accountId={id}` - List all transactions (with optional filter)
- `GET /transactions/:id` - Get transaction details
- `POST /transactions/deposit` - Deposit money
- `POST /transactions/withdraw` - Withdraw money (with interest calculation)

**Total**: 19 API endpoints

-----------------------------------------------------------

## 3. API Calls Per Screen

### 3.1 Dashboard Screen (`/`)
**On Load:**
1. `GET /api/customers` - Get total customers count
2. `GET /api/accounts` - Get total accounts and balance
3. `GET /api/transactions` - Get recent transactions
4. `GET /api/deposito-types` - Display available deposito types

**Purpose**: Display system overview with statistics

### 3.2 Customers Screen (`/customers`)
**On Load:**
1. `GET /api/customers` - Load all customers with account counts

**On Create:**
1. `POST /api/customers` - Create new customer
2. `GET /api/customers` - Refresh list

**On Edit:**
1. `PUT /api/customers/:id` - Update customer
2. `GET /api/customers` - Refresh list

**On Delete:**
1. `DELETE /api/customers/:id` - Delete customer (CASCADE deletes accounts & transactions)
2. `GET /api/customers` - Refresh list

### 3.3 Deposito Types Screen (`/deposito-types`)
**On Load:**
1. `GET /api/deposito-types` - Load all deposito types with account usage count

**On Create:**
1. `POST /api/deposito-types` - Create new deposito type
2. `GET /api/deposito-types` - Refresh list

**On Edit:**
1. `PUT /api/deposito-types/:id` - Update deposito type
2. `GET /api/deposito-types` - Refresh list

**On Delete:**
1. `DELETE /api/deposito-types/:id` - Delete deposito type (fails if in use)
2. `GET /api/deposito-types` - Refresh list

### 3.4 Accounts Screen (`/accounts`)
**On Load:**
1. `GET /api/accounts` - Load all accounts
2. `GET /api/customers` - Load customers for filter dropdown
3. `GET /api/deposito-types` - Load deposito types for filter

**On Filter:**
1. `GET /api/accounts?customerId={id}` - Filter accounts by customer

**On Create:**
1. `POST /api/accounts` - Create new account
2. `GET /api/accounts` - Refresh list

**On Edit:**
1. `PUT /api/accounts/:id` - Update account (packet, deposito type)
2. `GET /api/accounts` - Refresh list

**On Delete:**
1. `DELETE /api/accounts/:id` - Close account (CASCADE deletes transactions)
2. `GET /api/accounts` - Refresh list

### 3.5 Transactions Screen (`/transactions`)
**On Load:**
1. `GET /api/transactions` - Load all transactions
2. `GET /api/accounts` - Load accounts for filter and deposit/withdraw selection

**On Filter:**
1. `GET /api/transactions?accountId={id}` - Filter by account

**On Deposit:**
1. `POST /api/transactions/deposit` - Process deposit
2. `GET /api/accounts` - Refresh account balances
3. `GET /api/transactions` - Refresh transaction list

**On Withdraw:**
1. `POST /api/transactions/withdraw` - Process withdrawal with interest calculation
2. `GET /api/accounts` - Refresh account balances
3. `GET /api/transactions` - Refresh transaction list

**Withdraw Response Includes:**
- `endingBalance`: Final balance after interest
- `interestEarned`: Calculated interest amount
- `monthsHeld`: Duration money was deposited
- `summary`: Human-readable summary

-----------------------------------------------------------

## 4. API Documentation

**Swagger UI is available at**: `http://56.68.58.194/api/docs`

The Swagger documentation includes:
- Complete endpoint specifications
- Request/response schemas
- Example payloads
- Error responses
- Authentication requirements (if applicable)

-----------------------------------------------------------

## 5. API Collection


-----------------------------------------------------------

## 6. UML Diagram

**UML Diagram is available at**: `https://miro.com/app/board/uXjVGd65xww=/?share_link_id=435490097229`

The UML diagram includes:
- Use Case Diagram
- Class Diagram
- Sequence Diagram for deposit process
- Sequence Diagram for withdrawal process
- Activity Diagram for withdrawal process

-----------------------------------------------------------

## 7. Interest Calculation Algorithm

### Formula
```
ending_balance = starting_balance × (1 + monthly_return)^months
```

### Where:
- `starting_balance`: Current account balance
- `monthly_return`: (yearly_return / 12) / 100
- `months`: Months between last deposit and withdrawal

### Example:
```javascript
Starting Balance: Rp 1,000,000
Deposito Type: Silver (5% yearly)
Monthly Return: 5% / 12 = 0.4167%
Months Held: 6 months

Calculation:
ending_balance = 1,000,000 × (1 + 0.004167)^6
ending_balance = 1,000,000 × 1.025315
ending_balance = Rp 1,025,315

Interest Earned = 1,025,315 - 1,000,000 = Rp 25,315
```

### Implementation Notes:
1. Interest is calculated only on **withdrawals**
2. Months are calculated from the **last deposit** transaction date
3. If no deposits exist, months = 0 (no interest)
4. Interest is **compound interest**, not simple interest
5. All currency values use DECIMAL(15,2) for precision

-----------------------------------------------------------

## 8. Technology Stack

### Backend
- **Framework**: NestJS 10.x
- **Language**: TypeScript (Strict Mode)
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM
- **Documentation**: Swagger/OpenAPI
- **Architecture**: MVC (Entities defines the database schema + data as Model, Controllers receives requests and asks the Service for data, View is the JSON response shaped by DTOs. The actual UI rendering is handled by the separate Frontend application.)

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Architecture**: MVC (Types as database schema + data (Model), Server Components as Controllers or logic functions, Client Components as Views)

### Infrastructure
- **Server**: Backend on AWS EC2 t3.micro
- **Server**: Frontend on Vercel
- **Database**: AWS RDS db.t4g.micro (PostgreSQL)
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx
- **OS**: Ubuntu 24.04 LTS

-----------------------------------------------------------

## 9. Performance Considerations

1. **Database Indexing**: All foreign keys and frequently queried columns are indexed
2. **Connection Pooling**: PostgreSQL connection pool configured (max 20 connections)
3. **Transaction Safety**: Database transactions used for deposits/withdrawals
4. **Pessimistic Locking**: Prevents race conditions on concurrent transactions
5. **Efficient Queries**: Relations loaded only when needed

-----------------------------------------------------------

## 10. Security Measures

1. **SQL Injection Prevention**: TypeORM parameterized queries
2. **Validation**: DTOs with class validator on all inputs
3. **Error Handling**: Sensitive error details hidden in production
4. **CORS**: Configured to allow only specific origins (localhost:3001)
5. **Type Safety**: Strict TypeScript prevents runtime type errors
6. **Database Connection**: Only accept connection from EC2 Server and my computer IP (private for public)

**Note on Authentication**: 
- This is a **single-user system** designed for bank officer workstation
- No authentication/authorization implemented
- For production deployment with multiple users, consider adding:
  - JWT-based authentication
  - Role-based access control (RBAC)
  - User management module
    
