// title: Current Monthly Recurring Revenue (MRR)
// description: The current amount of money that is expected to be brought in every month.
// control: range 0 1000 1
const currentMRR = 692;

// title: Month-over-Month Growth Rate
// description: The percentage increase in MRR each month. Represented as a decimal (e.g., 0.1 foar 10% growth).
// control: range 0 0.1 0.001
const MoMGrowth = 0.04;

// title: Target Monthly Revenue
// description: The monthly revenue goal.
// control: range 0 2000 1
const targetMRR = 785;

// title: Months to Reach Target
// description: The estimated number of months required to reach the target monthly revenue.
const monthsToReachTarget =
  Math.log(targetMRR / currentMRR) / Math.log(1 + MoMGrowth);

// title: Years to Reach Target
// description: The Number of years to reach the target
const yearsToReachTarget = monthsToReachTarget / 12;
