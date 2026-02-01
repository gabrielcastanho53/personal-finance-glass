
// Verification script for Monthly Filtering (ESM)

const baseUrl = 'http://localhost:3000/api';

async function verify() {
    console.log('Verifying Monthly Filtering...');

    const email = `filtertest${Date.now()}@example.com`;
    const password = 'password123';

    // 1. Register & Login
    try {
        // Register
        await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // Login
        const loginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const { token, user } = await loginRes.json();
        console.log('Logged in.');

        // 2. Add Transactions
        const currentMonth = new Date();
        const prevMonth = new Date();
        prevMonth.setMonth(prevMonth.getMonth() - 1);

        // Add Current Month Transaction
        await fetch(`${baseUrl}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                description: 'Current Month Item',
                amount: 100,
                type: 'expense',
                category: 'Food',
                date: currentMonth.toISOString()
            })
        });

        // Add Previous Month Transaction
        await fetch(`${baseUrl}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                description: 'Previous Month Item',
                amount: 50,
                type: 'expense',
                category: 'Transport',
                date: prevMonth.toISOString()
            })
        });
        console.log('Added transactions for current and previous months.');

        // 3. Verify Filtering

        // Fetch Current Month
        const currentRes = await fetch(`${baseUrl}/transactions?month=${currentMonth.getMonth() + 1}&year=${currentMonth.getFullYear()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const currentData = await currentRes.json();
        console.log(`Current Month (${currentMonth.getMonth() + 1}) count: ${currentData.length}`);

        if (currentData.length === 1 && currentData[0].description === 'Current Month Item') {
            console.log('✅ Current month filter passed.');
        } else {
            console.error('❌ Current month filter failed.', currentData);
        }

        // Fetch Previous Month
        const prevRes = await fetch(`${baseUrl}/transactions?month=${prevMonth.getMonth() + 1}&year=${prevMonth.getFullYear()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const prevData = await prevRes.json();
        console.log(`Previous Month (${prevMonth.getMonth() + 1}) count: ${prevData.length}`);

        if (prevData.length === 1 && prevData[0].description === 'Previous Month Item') {
            console.log('✅ Previous month filter passed.');
        } else {
            console.error('❌ Previous month filter failed.', prevData);
        }

    } catch (e) {
        console.error('Verification error:', e);
    }
}

verify();
