
// Verification script for Profile Picture Feature (ESM)

const baseUrl = 'http://localhost:3000/api';

async function verify() {
    console.log('Verifying Profile Picture Feature...');

    const email = `profiletest${Date.now()}@example.com`;
    const password = 'password123';

    try {
        // 1. Register & Login
        await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const loginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;

        console.log('Logged in.');
        if (loginData.user.avatarUrl === null || loginData.user.avatarUrl === undefined) {
            console.log('✅ Initial avatar is null/undefined as expected.');
        } else {
            console.error('❌ Initial avatar should be null.', loginData.user);
        }

        // 2. Update Profile Picture
        const newAvatarUrl = "https://i.pravatar.cc/150?img=99";
        console.log(`Updating avatar to: ${newAvatarUrl}`);

        const updateRes = await fetch(`${baseUrl}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ avatarUrl: newAvatarUrl })
        });

        if (!updateRes.ok) {
            console.error('Update failed:', await updateRes.text());
            return;
        }

        const updateData = await updateRes.json();
        console.log('Update response:', updateData);

        if (updateData.user.avatarUrl === newAvatarUrl) {
            console.log('✅ Update response contains correct avatarUrl.');
        } else {
            console.error('❌ Update response has incorrect avatarUrl.');
        }

        // 3. Verify Persistence (Login again)
        console.log('Logging in again to verify persistence...');
        const reloginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const reloginData = await reloginRes.json();

        if (reloginData.user.avatarUrl === newAvatarUrl) {
            console.log('✅ Persistence verified. Avatar URL is correct on re-login.');
        } else {
            console.error('❌ Persistence failed.', reloginData.user);
        }

    } catch (e) {
        console.error('Verification error:', e);
    }
}

verify();
