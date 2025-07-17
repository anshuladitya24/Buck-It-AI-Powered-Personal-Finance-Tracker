// Financial analysis utilities for the chatbot

export const generateFinancialInsights = (transactions, accounts) => {
  const insights = [];
  
  // Calculate spending patterns
  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  // Find highest spending category
  const highestSpendingCategory = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)[0];

  if (highestSpendingCategory) {
    insights.push({
      type: 'spending_pattern',
      message: `Your highest spending category is ${highestSpendingCategory[0]} (₹${highestSpendingCategory[1].toFixed(2)})`
    });
  }

  // Calculate monthly trends
  const currentMonth = new Date().getMonth();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  
  const currentMonthSpending = transactions
    .filter(t => new Date(t.date).getMonth() === currentMonth && t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const lastMonthSpending = transactions
    .filter(t => new Date(t.date).getMonth() === lastMonth && t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  if (lastMonthSpending > 0) {
    const change = ((currentMonthSpending - lastMonthSpending) / lastMonthSpending) * 100;
    insights.push({
      type: 'monthly_trend',
      message: `Your spending is ${change > 0 ? 'up' : 'down'} ${Math.abs(change).toFixed(1)}% compared to last month`
    });
  }

  return insights;
};

export const generateSpendingRecommendations = (categorySpending) => {
  const recommendations = [];
  const sortedCategories = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a);

  // Recommendations based on top spending categories
  const topCategory = sortedCategories[0];
  if (topCategory) {
    const [category, amount] = topCategory;
    
    switch (category) {
      case 'food':
        recommendations.push('Try meal planning and cooking at home more often to reduce food expenses');
        break;
      case 'entertainment':
        recommendations.push('Look for free entertainment options like parks, free events, or home activities');
        break;
      case 'shopping':
        recommendations.push('Create a shopping list and stick to it. Wait 24 hours before non-essential purchases');
        break;
      case 'transportation':
        recommendations.push('Consider carpooling, public transport, or combining errands into single trips');
        break;
      case 'utilities':
        recommendations.push('Review your utility bills for energy-saving opportunities');
        break;
      default:
        recommendations.push(`Consider reviewing your ${category} expenses to identify potential savings`);
    }
  }

  return recommendations;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getSpendingInsight = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');
  
  const totalExpenses = expenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalIncome = income.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
  
  if (savingsRate > 20) {
    return { status: 'excellent', message: 'Great job! You\'re saving over 20% of your income.' };
  } else if (savingsRate > 10) {
    return { status: 'good', message: 'You\'re doing well with savings. Try to increase it gradually.' };
  } else if (savingsRate > 0) {
    return { status: 'fair', message: 'Your savings rate could be improved. Look for areas to reduce expenses.' };
  } else {
    return { status: 'concern', message: 'You\'re spending more than you earn. Consider reviewing your budget urgently.' };
  }
};
