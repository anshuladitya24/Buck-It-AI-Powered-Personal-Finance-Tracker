import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Get user's transactions and account data
    const [accounts, transactions] = await Promise.all([
      db.account.findMany({
        where: { userId },
        include: {
          _count: {
            select: { transactions: true }
          }
        }
      }),
      db.transaction.findMany({
        where: {
          account: {
            userId
          }
        },
        include: {
          account: true
        },
        orderBy: { date: 'desc' },
        take: 200 // Increased limit to get more transactions
      })
    ]);

    console.log('Debug - User ID:', userId);
    console.log('Debug - Found accounts:', accounts.length);
    console.log('Debug - Found transactions:', transactions.length);
    console.log('Debug - Sample transactions:', transactions.slice(0, 3));

    // Prepare financial data summary for AI
    const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance || 0), 0);
    const totalTransactions = transactions.length;
    
    // Calculate spending by category
    const spendingByCategory = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'expense') {
        const category = transaction.category || 'uncategorized';
        acc[category] = (acc[category] || 0) + parseFloat(transaction.amount || 0);
      }
      return acc;
    }, {});

    console.log('Debug - Spending by category:', spendingByCategory);

    // Calculate monthly spending
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySpending = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear &&
               t.type === 'expense';
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    // Calculate income vs expenses
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    // Recent transactions for context (more detailed)
    const recentTransactions = transactions.slice(0, 15).map(t => ({
      amount: parseFloat(t.amount || 0),
      category: t.category || 'uncategorized',
      description: t.description || 'No description',
      date: t.date ? new Date(t.date).toDateString() : 'No date',
      type: t.type || 'unknown',
      accountName: t.account?.name || 'Unknown account'
    }));

    console.log('Debug - Total income:', totalIncome);
    console.log('Debug - Total expenses:', totalExpenses);
    console.log('Debug - Recent transactions sample:', recentTransactions.slice(0, 3));

    const financialContext = {
      totalBalance,
      totalTransactions,
      monthlySpending,
      totalIncome,
      totalExpenses,
      spendingByCategory,
      recentTransactions,
      accountsCount: accounts.length
    };

    const prompt = `
You are Buck-It's AI Financial Advisor. You have access to the user's financial data and should provide helpful, personalized insights and advice.

IMPORTANT: The user HAS ${totalTransactions} transactions in their account. Do NOT say they have no transactions if the data shows they do.

User's Financial Summary:
- Total Balance: ₹${totalBalance.toFixed(2)}
- Total Transactions: ${totalTransactions}
- Monthly Spending: ₹${monthlySpending.toFixed(2)}
- Total Income: ₹${totalIncome.toFixed(2)}
- Total Expenses: ₹${totalExpenses.toFixed(2)}
- Number of Accounts: ${accounts.length}

Spending by Category (Total amounts):
${Object.entries(spendingByCategory).length > 0 
  ? Object.entries(spendingByCategory)
      .sort(([,a], [,b]) => b - a)
      .map(([category, amount]) => `- ${category}: ₹${amount.toFixed(2)}`)
      .join('\n')
  : '- No expense transactions found'
}

Recent Transactions (Last ${recentTransactions.length}):
${recentTransactions.length > 0 
  ? recentTransactions
      .map(t => `- ${t.type.toUpperCase()}: ₹${t.amount} - ${t.category} - ${t.description} (${t.date}) [${t.accountName}]`)
      .join('\n')
  : '- No recent transactions found'
}

User's Question: "${message}"

Guidelines:
1. Base your response on the ACTUAL DATA provided above
2. If the user has transactions, analyze them and provide insights
3. If asking about biggest expense category, look at the "Spending by Category" section
4. Be conversational, supportive, and specific to their data
5. Use emojis appropriately and keep responses concise but informative
6. When suggesting expense reduction, provide practical, actionable tips
7. Always be encouraging and positive while being realistic
8. Include specific numbers from their data when relevant
9. If they have concerning spending patterns, address them gently but clearly
10. For income vs expenses, provide savings rate insights

Common helpful responses:
- Spending analysis by category with percentages  
- Month-over-month spending trends
- Savings rate calculations
- Specific tips for reducing expenses in their highest spending categories
- Budget allocation suggestions (50/30/20 rule, etc.)
- Emergency fund recommendations based on their expenses
- Investment suggestions if they have positive cash flow
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    console.log('Debug - AI Response length:', aiResponse.length);
    console.log('Debug - AI Response preview:', aiResponse.substring(0, 200));

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error("Error in financial chat:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: "Failed to process your request. Please try again." },
      { status: 500 }
    );
  }
}
