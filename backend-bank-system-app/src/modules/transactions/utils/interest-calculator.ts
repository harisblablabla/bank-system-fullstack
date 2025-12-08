/**
 * Interest Calculator Utility
 * Formula: ending_balance = starting_balance * (1 + monthly_return)^months
 */

export interface InterestCalculation {
  monthsHeld: number;
  interestEarned: number;
  endingBalance: number;
}

export class InterestCalculator {
  /**
   * @param startDate - Initial deposit date
   * @param endDate - Withdrawal date
   * @returns Number of complete months
   */
  static calculateMonthsHeld(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const yearsDiff = end.getFullYear() - start.getFullYear();
    const monthsDiff = end.getMonth() - start.getMonth();

    let totalMonths = yearsDiff * 12 + monthsDiff;

    // If the end day is before the start day, don't count the current month
    if (end.getDate() < start.getDate()) {
      totalMonths--;
    }

    // Ensure we return at least 0 months
    return Math.max(0, totalMonths);
  }

  /**
   * Calculate interest earned and ending balance
   * @param startingBalance - Initial balance
   * @param yearlyReturnPercentage - Yearly return rate (e.g., 5.0 for 5%)
   * @param monthsHeld - Number of months money was held
   * @returns Calculation results
   */
  static calculateInterest(
    startingBalance: number,
    yearlyReturnPercentage: number,
    monthsHeld: number,
  ): InterestCalculation {
    // Convert yearly percentage to monthly decimal rate
    const monthlyRate = yearlyReturnPercentage / 12 / 100;

    // Calculate ending balance: starting_balance * (1 + monthly_rate)^months
    const endingBalance =
      startingBalance * Math.pow(1 + monthlyRate, monthsHeld);

    // Interest earned is the difference
    const interestEarned = endingBalance - startingBalance;

    return {
      monthsHeld,
      interestEarned: this.roundToTwoDecimals(interestEarned),
      endingBalance: this.roundToTwoDecimals(endingBalance),
    };
  }

  /**
   * Round number to 2 decimal places (for currency)
   */
  private static roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /**
   * Calculate interest for withdrawal with deposit date lookup
   * @param currentBalance - Current account balance
   * @param yearlyReturnPercentage - Yearly return rate
   * @param depositDate - When the money was deposited
   * @param withdrawalDate - When the money is being withdrawn
   * @returns Full calculation details
   */
  static calculateWithdrawalInterest(
    currentBalance: number,
    yearlyReturnPercentage: number,
    depositDate: Date,
    withdrawalDate: Date,
  ): InterestCalculation {
    const monthsHeld = this.calculateMonthsHeld(depositDate, withdrawalDate);
    return this.calculateInterest(
      currentBalance,
      yearlyReturnPercentage,
      monthsHeld,
    );
  }
}
