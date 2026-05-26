const baseURL = 'http://localhost:5173';
const email = process.env.GREENFRAME_TEST_EMAIL || 'admin@optiacademic.com';
const password = process.env.GREENFRAME_TEST_PASSWORD || 'admin123';

const environmentalImpactScenario = async (page) => {
    await page.goto(baseURL, { waitUntil: 'networkidle' });

    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const loginRequired = await emailInput.isVisible().catch(() => false);

    if (loginRequired) {
        await page.addMilestone('Login screen loaded');
        const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
        const submitButton = page.locator('button[type="submit"], button:has-text("Iniciar sesi")').first();

        await emailInput.fill(email);
        await passwordInput.fill(password);
        await Promise.all([
            page.waitForURL(/\/admin(?:\/dashboard)?(?:[/?#]|$)/, {
                waitUntil: 'networkidle',
            }),
            submitButton.click(),
        ]);
        await page.addMilestone('Admin authenticated');
    }

    await page.goto(`${baseURL}/admin/dashboard`, { waitUntil: 'networkidle' });
    await page.addMilestone('Admin dashboard loaded');
    await page.goto(`${baseURL}/admin/environmental-impact`, { waitUntil: 'networkidle' });
    await page.locator('h1:has-text("Impacto ambiental")').first().waitFor();
    await page.addMilestone('Environmental impact dashboard loaded');

    // Keep the measured dashboard session long enough for a representative sample.
    await page.waitForTimeout(11000);
    await page.waitForNetworkIdle();
};

module.exports = environmentalImpactScenario;
