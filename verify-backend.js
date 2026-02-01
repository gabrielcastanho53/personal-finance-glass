
// Standalone verification script (ESM)
// No external dependencies except built-in fetch (Node 18+)

const baseUrl = 'http://localhost:3000/api';

async function verify() {
    console.log('Verifying backend with standalone script...');

    // 1. Register
    try {
        const email = `admin@example.com`;
        const password = 'admin123';
        console.log(`Registering user: ${email}`);

        // Node 18 fetch is global
        const regRes = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!regRes.ok) {
            const errorText = await regRes.text();
            if (errorText.includes('User already exists')) {
                console.log('User already exists, proceeding to login...');
            } else {
                console.error('Registration failed:', errorText);
                return;
            }
        } else {
            const regData = await regRes.json();
            console.log('Registration success:', regData);
        }

        // 2. Login
        console.log('Logging in...');
        const loginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) {
            console.error('Login failed:', await loginRes.text());
            return;
        }
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login success, token received.');

        // 3. Add Transaction
        console.log('Adding transaction...');
        const txRes = await fetch(`${baseUrl}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                description: 'Test Verification Transaction',
                amount: 150.75,
                type: 'income',
                category: 'Salary',
                date: new Date().toISOString()
            })
        });

        if (!txRes.ok) {
            console.error('Add transaction failed:', await txRes.text());
            return;
        }
        const txData = await txRes.json();
        console.log('Transaction added:', txData.description);

        // 4. Get Transactions
        console.log('Fetching transactions...');
        const getRes = await fetch(`${baseUrl}/transactions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!getRes.ok) {
            console.error('Get transactions failed:', await getRes.text());
            return;
        }
        const transactions = await getRes.json();
        console.log(`Fetched ${transactions.length} transactions.`);

        if (transactions.length > 0 && transactions[0].description === 'Test Verification Transaction') {
            console.log('Transaction verified.');

            // 5. Delete Transaction
            const txId = transactions[0].id;
            console.log(`Deleting transaction ${txId}...`);
            const delRes = await fetch(`${baseUrl}/transactions/${txId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!delRes.ok) {
                console.error('Delete transaction failed:', await delRes.text());
                return;
            }
            console.log('Transaction deleted successfully.');

            // Verify deletion
            const verifyRes = await fetch(`${baseUrl}/transactions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const verifyTx = await verifyRes.json();
            if (verifyTx.find(t => t.id === txId)) {
                console.error('Transaction still exists after deletion!');
            } else {
                console.log('VERIFICATION PASSED! (Add & Delete working)');
            }

        } else {
            console.log('Verification inconclusive (transaction not found?)');
        }

    } catch (e) {
        console.error('Verification error:', e);
    }
}

verify();
