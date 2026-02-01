
import fs from 'node:fs/promises';

const baseUrl = 'http://localhost:3000/api';

async function verify() {
    console.log('Verifying File Upload Feature...');

    const email = `uploadtest${Date.now()}@example.com`;
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

        // 2. Create dummy image file
        await fs.writeFile('test-image.txt', 'This is a test image content');

        // 3. Upload File
        const formData = new FormData();
        // In Node 18, File is available globally or via blob
        const file = new Blob(['This is a test image content'], { type: 'text/plain' });
        formData.append('avatar', file, 'test-image.txt');

        console.log('Uploading file...');
        const updateRes = await fetch(`${baseUrl}/users/profile`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!updateRes.ok) {
            console.error('Update failed:', await updateRes.text());
            return;
        }

        const updateData = await updateRes.json();
        console.log('Update response user:', updateData.user);

        if (updateData.user.avatarUrl && updateData.user.avatarUrl.includes('/uploads/')) {
            console.log('✅ Update response contains upload URL:', updateData.user.avatarUrl);
        } else {
            console.error('❌ Update response missing valid avatarUrl.', updateData.user);
            return;
        }

        // 4. Verify Static File Access
        console.log('Verifying file access...');
        const fileRes = await fetch(updateData.user.avatarUrl);
        if (fileRes.ok) {
            const text = await fileRes.text();
            if (text === 'This is a test image content') {
                console.log('✅ Uploaded file content verified.');
            } else {
                console.error('❌ Uploaded file content mismatch.');
            }
        } else {
            console.error('❌ Failed to fetch uploaded file.', fileRes.status);
        }

    } catch (e) {
        console.error('Verification error:', e);
    } finally {
        // Cleanup
        try {
            await fs.unlink('test-image.txt');
        } catch (e) { }
    }
}

verify();
