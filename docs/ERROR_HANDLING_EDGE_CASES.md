# Belimbing Bank Saving System - Error Handling & Edge Cases

---

## 1. Global Error Handling Strategy

### 1.1 Error Response Format
All API errors follow this standardized format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": ["Additional error details"]
  }
}
```

### 1.2 HTTP Status Codes

| Status Code | Meaning | Use Case |
|-------------|---------|----------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Validation errors, business logic violations |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entries, referential integrity violations |
| 500 | Internal Server Error | Unexpected server errors |

---

## 2. Validation Errors (400 Bad Request)

### 2.1 Customer Validation

#### Error: Empty Name
**Trigger**: Creating/updating customer with empty or whitespace-only name
```json
Request: POST /api/customers
{
  "name": "  "
}

Response: 400
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name is required"
  }
}
```

#### Error: Name Too Short
**Trigger**: Name less than 2 characters
```json
Request: POST /api/customers
{
  "name": "A"
}

Response: 400
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Name must be at least 2 characters"
  }
}
```

---

### 2.2 Deposito Type Validation

#### Error: Invalid Yearly Return
**Trigger**: Yearly return outside 0-100 range
```json
Request: POST /api/deposito-types
{
  "name": "Deposito Ultra",
  "yearlyReturn": 150
}

Response: 400
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Yearly return must not exceed 100"
  }
}
```

#### Error: Duplicate Deposito Type Name
**Trigger**: Creating deposito type with existing name
```json
Request: POST /api/deposito-types
{
  "name": "Deposito Bronze",
  "yearlyReturn": 3.0
}

Response: 409
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Deposito type with name 'Deposito Bronze' already exists"
  }
}
```

---

### 2.3 Account Validation

#### Error: Invalid Customer Reference
**Trigger**: Creating account with non-existent customer ID
```json
Request: POST /api/accounts
{
  "packet": "Savings",
  "customerId": "00000000-0000-0000-0000-000000000000",
  "depositoTypeId": "valid-uuid"
}

Response: 404
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Customer with ID 00000000-0000-0000-0000-000000000000 not found"
  }
}
```

#### Error: Invalid Deposito Type Reference
**Trigger**: Creating account with non-existent deposito type
```json
Response: 404
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Deposito type with ID {id} not found"
  }
}
```

---

### 2.4 Transaction Validation

#### Error: Invalid Amount (Negative or Zero)
**Trigger**: Deposit/withdraw with amount ≤ 0
```json
Request: POST /api/transactions/deposit
{
  "accountId": "valid-uuid",
  "amount": -100,
  "transactionDate": "2024-12-10T10:00:00Z"
}

Response: 400
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Amount must be greater than 0"
  }
}
```

#### Error: Insufficient Balance
**Trigger**: Withdrawal exceeds account balance
```json
Request: POST /api/transactions/withdraw
{
  "accountId": "valid-uuid",
  "amount": 10000000,
  "transactionDate": "2024-12-10T10:00:00Z"
}

Response: 400
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Insufficient balance. Available: 1000000, Requested: 10000000"
  }
}
```

---

## 3. Referential Integrity Errors (409 Conflict)

### 3.1 Cannot Delete Customer with Accounts
**Trigger**: Deleting customer who has open accounts
**Resolution**: System ALLOWS this (CASCADE delete), but warns user in frontend

```json
// Backend automatically deletes:
// 1. Customer
// 2. All their accounts (CASCADE)
// 3. All transactions of those accounts (CASCADE)
```

### 3.2 Cannot Delete Deposito Type in Use
**Trigger**: Deleting deposito type that has active accounts
```json
Request: DELETE /api/deposito-types/{id}

Response: 409
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Cannot delete deposito type: 5 account(s) are using it"
  }
}
```

**Resolution**: 
1. Reassign all accounts to different deposito type
2. Or delete all accounts first
3. Then delete the deposito type

---

## 4. Not Found Errors (404)

### 4.1 Resource Not Found
**Trigger**: Requesting non-existent resource
```json
Request: GET /api/customers/invalid-uuid

Response: 404
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Customer with ID invalid-uuid not found"
  }
}
```

**Applies to**: All GET by ID, PUT, DELETE operations

---

## 5. Edge Cases & Business Logic

### 5.1 Zero Balance Withdrawal
**Scenario**: Account has Rp 0 balance, user tries to withdraw

**Handling**:
```json
Response: 400
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Insufficient balance. Available: 0, Requested: 100000"
  }
}
```

---

### 5.2 Interest Calculation with No Deposits
**Scenario**: Account created but never had deposits, user tries to withdraw

**Handling**:
- `monthsHeld = 0`
- `interestEarned = 0`
- `endingBalance = currentBalance`
- Transaction proceeds without interest

```json
Response: 201
{
  "success": true,
  "data": {
    "monthsHeld": 0,
    "interestEarned": 0.00,
    "endingBalance": 0.00
  }
}
```

---

### 5.3 Multiple Deposits (Interest Calculation)
**Scenario**: Customer makes multiple deposits over time

**Handling**:
- System uses **LAST DEPOSIT** date for interest calculation
- This simplifies the calculation to single compound interest period
- **Limitation**: Earlier deposits don't compound separately

**Example**:
```
Day 1: Deposit Rp 500,000
Day 30: Deposit Rp 500,000 (LAST DEPOSIT)
Day 60: Withdraw Rp 1,000,000

Interest Calculation:
- Uses Day 30 as start date (last deposit)
- Months held = 1 month (Day 30 to Day 60)
- Base amount = Rp 1,000,000 (current balance)
```

**Future Enhancement**: Track each deposit separately for more accurate compound interest

---

### 5.4 Same-Day Deposit and Withdrawal
**Scenario**: Deposit money and withdraw on same day

**Handling**:
- `monthsHeld = 0`
- `interestEarned = 0`
- Transaction proceeds without interest

---

### 5.5 Negative Month Calculation
**Scenario**: Withdrawal date is BEFORE deposit date (data integrity issue)

**Handling**:
```typescript
// In InterestCalculator
const monthsHeld = Math.max(0, calculatedMonths);
```
- System ensures `monthsHeld` is never negative
- Returns 0 months, 0 interest

---

### 5.6 Very Large Balances
**Scenario**: Account balance exceeds DECIMAL(15,2) precision

**Handling**:
- Database constraint: DECIMAL(15,2) = 13 digits + 2 decimal places
- Maximum value: 9,999,999,999,999.99 (~ 10 trillion)
- **Edge case**: If exceeded, database will reject with error

```json
Response: 500
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Database constraint violation"
  }
}
```

---

### 5.7 Concurrent Transactions (Race Conditions)
**Scenario**: Two users try to withdraw from same account simultaneously

**Handling**: Pessimistic Locking
```typescript
// In TransactionsService
const account = await queryRunner.manager.findOne(Account, {
  where: { id },
  lock: { mode: 'pessimistic_write' } // Locks row until transaction completes
});
```

**Result**:
- First transaction acquires lock
- Second transaction waits
- Second transaction processes after first completes
- Prevents double-spending

---

## 6. Frontend-Specific Error Handling

### 6.1 API Connection Failure
**Scenario**: Backend is down or unreachable

**Handling**:
```typescript
try {
  const response = await fetch(url);
  // Process response
} catch (error) {
  // Display user-friendly error
  setError("Unable to connect to server. Please check your connection.");
}
```

---

### 6.2 Stale Data After Mutations
**Scenario**: Balance shown is outdated after deposit/withdrawal

**Solution**: Auto-refresh accounts after transactions
```typescript
const handleDepositSuccess = async () => {
  await refreshAccounts(); // Fetch latest balances
  await refreshTransactions(); // Fetch latest transactions
  setIsDepositOpen(false);
};
```

---

### 6.3 Form Validation Before Submission
**Scenario**: User enters invalid data

**Handling**:
- Client-side validation before API call
- Prevents unnecessary network requests
- Provides instant feedback

```typescript
if (!amount || parseFloat(amount) <= 0) {
  setError("Amount must be greater than 0");
  return;
}
```

---

## 7. Database-Level Safeguards

### 7.1 CHECK Constraints
```sql
-- Prevent negative balances
CHECK (balance >= 0)

-- Prevent invalid interest rates
CHECK (yearly_return >= 0 AND yearly_return <= 100)

-- Prevent zero/negative transaction amounts
CHECK (amount > 0)
```

### 7.2 Foreign Key Constraints
```sql
-- Prevent orphan records
FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
FOREIGN KEY (deposito_type_id) REFERENCES deposito_types(id) ON DELETE RESTRICT
```

### 7.3 UNIQUE Constraints
```sql
-- Prevent duplicate deposito type names
UNIQUE (name)
```

---

## 8. Logging & Debugging

### 8.1 Error Logging
All errors are logged with:
- Timestamp
- Error type
- Stack trace (in development)
- Request details

```typescript
this.logger.error(`Withdrawal failed: ${error.message}`, error.stack);
```

### 8.2 Production vs Development
**Development**:
- Full error details exposed
- Stack traces included
- Verbose logging

**Production**:
- Generic error messages to users
- Detailed errors logged server-side only
- Minimal information exposure

---

## 9. Recovery Strategies

### 9.1 Database Transaction Rollback
All mutations use database transactions:
```typescript
try {
  await queryRunner.startTransaction();
  // Perform operations
  await queryRunner.commitTransaction();
} catch (error) {
  await queryRunner.rollbackTransaction(); 
  throw error;
}
```

### 9.2 Retry Logic (Frontend)
For network failures:
- User can manually retry via "Refresh" button
- User can retry failed operation via error message

---

## 10. Security Considerations

### 10.1 SQL Injection Prevention
- All queries use parameterized queries (TypeORM)
- No raw SQL with user input

### 10.2 Input Sanitization
- All inputs validated with class-validator
- Whitespace trimmed
- Special characters handled

### 10.3 UUID Usage
- Prevents ID enumeration attacks
- IDs are not sequential or predictable

---

**End of Error Handling & Edge Cases Document**