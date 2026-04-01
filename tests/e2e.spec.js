const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = `file://${path.resolve(__dirname, '../index.html')}`;

// ----------------------------------------------------------------
// helpers
// ----------------------------------------------------------------

async function waitForScreen(page, screenId) {
  await page.waitForSelector(`#${screenId}.active`, { timeout: 15_000 });
}

async function solveQuiz(page) {
  // 6 questions, each auto-advances after 1600ms
  for (let i = 0; i < 6; i++) {
    await page.waitForSelector('.ans-btn', { timeout: 5000 });

    // Ask the app JS for the correct answer text of the current question
    const correctText = await page.evaluate(() => {
      const q = QS.qs[QS.cur];
      return q.ans[q.ok];
    });

    // Click the button that contains the correct answer text
    await page.locator(`.ans-btn:has-text("${correctText}")`).click();

    // Wait for auto-advance (1600ms delay in app)
    await page.waitForTimeout(1800);
  }
}

async function solveMath(page) {
  // 4 questions, must all be answered correctly, advances after 1100ms
  for (let i = 0; i < 4; i++) {
    await page.waitForSelector('.numpad-btn', { timeout: 5000 });

    const answer = await page.evaluate(() => MS.qs[MS.cur].ans.toString());

    // Type each digit via numpad buttons
    for (const digit of answer) {
      await page.locator(`.numpad-btn:has-text("${digit}")`).first().click();
    }

    // Press confirm (✓ button)
    await page.locator('.numpad-btn:has-text("✓")').click();

    // Wait for advance (1100ms delay in app)
    await page.waitForTimeout(1300);
  }
}

async function solveReflex(page) {
  // Click START button
  await page.locator('#reflex-start button').click();

  // Click 10 targets to win immediately (RS.hits >= 10 → success)
  for (let i = 0; i < 10; i++) {
    await page.waitForSelector('.target-dot', { timeout: 5000 });
    await page.locator('.target-dot').click({ force: true });
    await page.waitForTimeout(300);
  }
}

async function solveMemory(page) {
  // All 12 cards are rendered with data-emoji attributes.
  // Read them, build a pair map, click each pair.
  await page.waitForSelector('.mem-card', { timeout: 5000 });

  const cardCount = await page.locator('.mem-card').count();
  expect(cardCount).toBe(12);

  // Keep clicking pairs until all 6 are matched
  for (let pair = 0; pair < 6; pair++) {
    // Get indices of unmatched cards grouped by emoji
    const { firstIdx, secondIdx } = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.mem-card:not(.matched)'));
      const seen = {};
      for (let i = 0; i < cards.length; i++) {
        const emoji = cards[i].dataset.emoji;
        if (seen[emoji] !== undefined) {
          return { firstIdx: seen[emoji], secondIdx: i };
        }
        seen[emoji] = i;
      }
      return null;
    });

    const unmatched = page.locator('.mem-card:not(.matched)');
    await unmatched.nth(firstIdx).click();
    await page.waitForTimeout(200);
    await unmatched.nth(secondIdx).click();

    // Wait for match animation (400ms) + small buffer
    await page.waitForTimeout(600);
  }
}

async function solveField(page) {
  await page.fill('#field-input', 'AGENT');
  await page.keyboard.press('Enter');
}

// ----------------------------------------------------------------
// test
// ----------------------------------------------------------------

test('Full e2e: login → 5 misji → skarbiec', async ({ page }) => {

  await page.goto(FILE_URL);

  // --- LOGIN ---
  await waitForScreen(page, 'screen-login');
  await page.fill('#login-input', 'KUBA2026');
  await page.keyboard.press('Enter');

  // --- BOOT SEQUENCE (~5s) ---
  await waitForScreen(page, 'screen-boot');
  await waitForScreen(page, 'screen-briefing');

  // --- BRIEFING ---
  await page.waitForSelector('#btn-to-missions', { timeout: 15_000 });
  await page.click('#btn-to-missions');

  // --- MISSIONS GRID ---
  await waitForScreen(page, 'screen-missions');
  await expect(page.locator('#progress-text')).toHaveText('0 / 5');

  // --- MISJA 1: QUIZ ---
  await page.locator('.mission-card').nth(0).click();
  await waitForScreen(page, 'screen-mission1');
  await solveQuiz(page);
  // completion overlay
  await page.waitForSelector('#ov-complete.show', { timeout: 5000 });
  await expect(page.locator('#ov-code')).toHaveText('KU');
  await page.click('#ov-btn');

  // --- MISJA 2: MATEMATYKA ---
  await waitForScreen(page, 'screen-missions');
  await page.locator('.mission-card').nth(1).click();
  await waitForScreen(page, 'screen-mission2');
  await solveMath(page);
  await page.waitForSelector('#ov-complete.show', { timeout: 5000 });
  await expect(page.locator('#ov-code')).toHaveText('BA');
  await page.click('#ov-btn');

  // --- MISJA 3: REFLEKSY ---
  await waitForScreen(page, 'screen-missions');
  await page.locator('.mission-card').nth(2).click();
  await waitForScreen(page, 'screen-mission3');
  await solveReflex(page);
  await page.waitForSelector('#ov-complete.show', { timeout: 10_000 });
  await expect(page.locator('#ov-code')).toHaveText('07');
  await page.click('#ov-btn');

  // --- MISJA 4: MEMORY ---
  await waitForScreen(page, 'screen-missions');
  await page.locator('.mission-card').nth(3).click();
  await waitForScreen(page, 'screen-mission4');
  await solveMemory(page);
  await page.waitForSelector('#ov-complete.show', { timeout: 10_000 });
  await expect(page.locator('#ov-code')).toHaveText('XY');
  await page.click('#ov-btn');

  // --- MISJA 5: TERENOWA ---
  await waitForScreen(page, 'screen-missions');
  await page.locator('.mission-card').nth(4).click();
  await waitForScreen(page, 'screen-mission5');
  await solveField(page);
  await page.waitForSelector('#ov-complete.show', { timeout: 5000 });
  await expect(page.locator('#ov-code')).toHaveText('ZZ');
  await page.click('#ov-btn');

  // --- SKARBIEC (auto-trigger after last mission) ---
  await waitForScreen(page, 'screen-vault');
  await expect(page.locator('#master-code-display')).toHaveText('KUBA07XYZZ');
});
