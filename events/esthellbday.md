---
layout: tool-content
title: Esthell's Birthday - Platopedia
heading: Esthell's Birthday
---

<style>
    @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Cinzel+Decorative:wght@700;900&family=Cormorant+Garamond:wght@500;600;700&display=swap");

    #esthell-birthday {
        --eb-bg: #fbf7eb;
        --eb-surface: #ffffff;
        --eb-surface-soft: #f4eedf;
        --eb-text: #173228;
        --eb-muted: #5f6d65;
        --eb-line: #dfd0a7;
        --eb-emerald: #08724f;
        --eb-gold: #b88923;
        --eb-shadow: rgba(35, 27, 7, .12);
        --eb-font-body: "Cormorant Garamond", "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif;
        --eb-font-heading: "Cinzel", "Cormorant Garamond", Georgia, "Times New Roman", serif;
        --eb-font-display: "Cinzel Decorative", "Cinzel", "Trajan Pro", Georgia, "Times New Roman", serif;
        width: 100%;
        max-width: 1080px;
        margin: 0 auto;
        color: var(--eb-text);
        font-family: var(--eb-font-body);
        background: var(--eb-bg);
        border: 1px solid var(--eb-line);
        border-radius: 8px;
        overflow: hidden;
    }

    body[data-theme="dark"] #esthell-birthday {
        --eb-bg: #071711;
        --eb-surface: #0d241b;
        --eb-surface-soft: #102f23;
        --eb-text: #fff8df;
        --eb-muted: rgba(255, 248, 223, .72);
        --eb-line: rgba(255, 227, 155, .28);
        --eb-emerald: #18a86f;
        --eb-gold: #b88923;
        --eb-shadow: rgba(0, 0, 0, .28);
    }

    #esthell-birthday,
    #esthell-birthday * {
        box-sizing: border-box;
    }

    #esthell-birthday img {
        display: block;
        max-width: 100%;
        height: auto;
        user-select: none;
        -webkit-user-drag: none;
    }

    #esthell-birthday :where(h1, h2, h3, p, strong, span, a, button, label, input, td, th) {
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    #esthell-birthday :where(h1, h2, h3) {
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        color: inherit;
        background: none !important;
        box-shadow: none !important;
        letter-spacing: 0;
    }

    #esthell-birthday :where(h1, h2, h3)::before,
    #esthell-birthday :where(h1, h2, h3)::after {
        content: none !important;
        display: none !important;
    }

    #esthell-birthday p {
        margin: 0;
        color: var(--eb-muted);
        font-size: 1.08rem;
        line-height: 1.6;
    }

    #esthell-birthday strong {
        color: var(--eb-gold);
    }

    #esthell-birthday button,
    #esthell-birthday input {
        font: inherit;
    }

    #esthell-birthday button,
    #esthell-birthday a {
        touch-action: manipulation;
    }

    #esthell-birthday :focus-visible {
        outline: 3px solid var(--eb-gold);
        outline-offset: 3px;
    }

    #esthell-birthday .eb-hero {
        display: grid;
        gap: 18px;
        padding: 18px;
        background: var(--eb-bg);
    }

    #esthell-birthday .eb-banner {
        width: 100%;
        border: 1px solid var(--eb-line);
        border-radius: 8px;
        background: var(--eb-surface-soft);
        box-shadow: 0 16px 34px var(--eb-shadow);
    }

    #esthell-birthday .eb-hero-copy {
        display: grid;
        gap: 8px;
        max-width: 780px;
        margin: 0 auto;
        text-align: center;
    }

    #esthell-birthday h1 {
        color: var(--eb-gold);
        font-family: var(--eb-font-display);
        font-size: 2.85rem;
        font-weight: 900;
        line-height: 1.03;
        text-transform: uppercase;
        text-shadow:
            0 1px 0 #f7d982,
            0 2px 0 #6d4308,
            0 4px 10px rgba(0, 0, 0, .24),
            0 0 14px rgba(184, 137, 35, .35);
    }

    #esthell-birthday .eb-section {
        padding: 22px 18px;
        border-top: 1px solid var(--eb-line);
    }

    #esthell-birthday .eb-section-head {
        margin-bottom: 14px;
    }

    #esthell-birthday h2 {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: var(--eb-emerald);
        font-family: var(--eb-font-heading);
        font-size: 1.55rem;
        font-weight: 700;
        line-height: 1.1;
    }

    #esthell-birthday h2::after {
        content: "" !important;
        display: block !important;
        width: 42px;
        height: 3px;
        border-radius: 999px;
        background: repeating-linear-gradient(90deg, var(--eb-gold) 0 12px, var(--eb-emerald) 12px 24px);
        background-size: 48px 100%;
        animation: ebAccentMove 2.4s linear infinite;
    }

    @keyframes ebAccentMove {
        to {
            background-position: 48px 0;
        }
    }

    #esthell-birthday .eb-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 14px;
        align-items: stretch;
    }

    #esthell-birthday .eb-card {
        border: 1px solid var(--eb-line);
        border-radius: 8px;
        background: var(--eb-surface);
        box-shadow: 0 12px 26px var(--eb-shadow);
        padding: 16px;
    }

    #esthell-birthday .eb-event-card {
        display: grid;
        gap: 14px;
    }

    #esthell-birthday .eb-facts {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    #esthell-birthday .eb-fact,
    #esthell-birthday .eb-stat {
        display: grid;
        align-content: center;
        justify-items: center;
        gap: 4px;
        min-height: 68px;
        padding: 10px;
        border: 1px solid var(--eb-line);
        border-radius: 8px;
        background: var(--eb-surface-soft);
        text-align: center;
    }

    #esthell-birthday .eb-label,
    #esthell-birthday .eb-fact span,
    #esthell-birthday .eb-stat span,
    #esthell-birthday .eb-time span {
        color: var(--eb-muted);
        font-family: var(--eb-font-heading);
        font-size: .78rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0;
    }

    #esthell-birthday .eb-fact strong,
    #esthell-birthday .eb-stat strong {
        color: var(--eb-gold);
        font-family: var(--eb-font-heading);
        font-size: 1.12rem;
        font-weight: 700;
        line-height: 1.1;
        font-variant-numeric: tabular-nums;
    }

    #esthell-birthday .eb-stat strong span {
        color: inherit;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        text-transform: none;
    }

    #esthell-birthday .eb-countdown-card {
        display: grid;
        align-content: center;
        justify-items: center;
        min-height: 100%;
        text-align: center;
    }

    #esthell-birthday .eb-countdown {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 8px;
        max-width: 100%;
        white-space: nowrap;
    }

    #esthell-birthday .eb-time {
        display: inline-flex;
        align-items: baseline;
        gap: 3px;
    }

    #esthell-birthday .eb-time + .eb-time::before {
        content: ":";
        margin-right: 8px;
        color: var(--eb-muted);
        font-weight: 900;
    }

    #esthell-birthday .eb-time strong {
        color: var(--eb-gold);
        font-family: var(--eb-font-heading);
        font-size: 1.7rem;
        font-weight: 700;
        line-height: 1;
        font-variant-numeric: tabular-nums;
    }

    #esthell-birthday .eb-time span {
        text-transform: lowercase;
    }

    #esthell-birthday .eb-frame-card {
        display: grid;
        grid-template-columns: 220px minmax(0, 1fr);
        gap: 18px;
        align-items: center;
    }

    #esthell-birthday .eb-frame-card img {
        width: 220px;
        justify-self: center;
        border: 1px solid var(--eb-line);
        border-radius: 8px;
        background: var(--eb-surface-soft);
    }

    #esthell-birthday .eb-frame-copy {
        display: grid;
        gap: 12px;
        align-content: center;
    }

    #esthell-birthday .eb-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        width: fit-content;
        max-width: 100%;
        padding: 10px 14px;
        border: 1px solid var(--eb-line);
        border-radius: 8px;
        background: var(--eb-gold);
        color: #102017 !important;
        font-family: var(--eb-font-heading);
        font-weight: 900;
        text-decoration: none !important;
        cursor: pointer;
        box-shadow: 0 8px 18px var(--eb-shadow);
        transition: transform .16s ease, box-shadow .16s ease, filter .16s ease;
    }

    #esthell-birthday .eb-button:hover {
        transform: translateY(-2px);
        filter: saturate(1.05);
        box-shadow: 0 12px 24px var(--eb-shadow);
    }

    #esthell-birthday .eb-button:active {
        transform: translateY(0);
    }

    #esthell-birthday .eb-button[disabled] {
        cursor: not-allowed;
        opacity: .65;
        transform: none;
    }

    #esthell-birthday .eb-sponsor-top {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 14px;
        align-items: center;
        margin-bottom: 14px;
    }

    #esthell-birthday .eb-stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    #esthell-birthday .eb-form {
        display: none;
        margin-bottom: 14px;
        padding: 14px;
        border: 1px solid var(--eb-line);
        border-radius: 8px;
        background: var(--eb-surface);
        box-shadow: 0 12px 26px var(--eb-shadow);
    }

    #esthell-birthday .eb-form.is-open {
        display: grid;
        gap: 10px;
    }

    #esthell-birthday .eb-form-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    #esthell-birthday .eb-field {
        display: grid;
        gap: 6px;
        min-width: 0;
    }

    #esthell-birthday .eb-field input {
        width: 100%;
        min-height: 42px;
        padding: 9px 10px;
        border: 1px solid var(--eb-line);
        border-radius: 8px;
        background: var(--eb-bg) !important;
        color: var(--eb-text) !important;
        -webkit-text-fill-color: var(--eb-text) !important;
        caret-color: var(--eb-emerald);
        appearance: none;
        -webkit-appearance: none;
    }

    #esthell-birthday .eb-field input::placeholder {
        color: var(--eb-muted) !important;
        -webkit-text-fill-color: var(--eb-muted) !important;
        opacity: .78;
    }

    #esthell-birthday .eb-field input:focus {
        border-color: var(--eb-emerald);
        box-shadow: 0 0 0 3px rgba(8, 114, 79, .16);
    }

    #esthell-birthday .eb-field input:-webkit-autofill,
    #esthell-birthday .eb-field input:-webkit-autofill:hover,
    #esthell-birthday .eb-field input:-webkit-autofill:focus {
        -webkit-text-fill-color: var(--eb-text) !important;
        box-shadow: 0 0 0 1000px var(--eb-bg) inset !important;
        transition: background-color 9999s ease-in-out 0s;
    }

    #esthell-birthday .eb-form-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        margin-top: 2px;
    }

    #esthell-birthday .eb-honeypot {
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }

    #esthell-birthday .eb-form-status {
        margin: 0;
        color: var(--eb-emerald);
        font-weight: 800;
        text-align: center;
    }

    #esthell-birthday .eb-form-status:empty {
        display: none;
    }

    #esthell-birthday .eb-table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        border: 1px solid var(--eb-line);
        border-radius: 8px;
        overflow: hidden;
        background: var(--eb-surface);
        box-shadow: 0 12px 26px var(--eb-shadow);
    }

    #esthell-birthday .eb-table th,
    #esthell-birthday .eb-table td {
        width: 50%;
        padding: 9px 10px;
        border-bottom: 1px solid var(--eb-line);
        color: var(--eb-text);
        line-height: 1.25;
        text-align: center;
        vertical-align: middle;
    }

    #esthell-birthday .eb-table th {
        color: #102017;
        background: var(--eb-gold);
        font-family: var(--eb-font-heading);
        font-weight: 900;
    }

    #esthell-birthday .eb-table td:last-child {
        font-variant-numeric: tabular-nums;
    }

    #esthell-birthday .eb-table tbody tr:nth-child(even) {
        background: var(--eb-surface-soft);
    }

    #esthell-birthday .eb-final {
        padding: 24px 18px 28px;
        border-top: 1px solid var(--eb-line);
        text-align: center;
        background: var(--eb-surface-soft);
    }

    #esthell-birthday .eb-final h2 {
        display: block;
        width: 100%;
        color: var(--eb-gold);
        font-family: var(--eb-font-display);
        font-size: 2rem;
        font-weight: 900;
        line-height: 1.08;
        text-transform: uppercase;
        text-shadow:
            0 1px 0 #f7d982,
            0 2px 0 #6d4308,
            0 4px 10px rgba(0, 0, 0, .2);
        text-align: center !important;
    }

    #esthell-birthday .eb-final #final-title::after {
        content: none !important;
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background: none !important;
    }

    #esthell-birthday .eb-final p {
        max-width: 520px;
        margin: 8px auto 0;
        color: var(--eb-muted);
        font-family: inherit;
        font-size: 1.06rem;
        font-style: normal;
        line-height: 1.55;
        text-align: center;
    }

    @media (max-width: 820px) {
        #esthell-birthday {
            border-radius: 0;
            border-left: 0;
            border-right: 0;
        }

        #esthell-birthday h1 {
            font-size: 2.28rem;
        }

        #esthell-birthday h2 {
            font-size: 1.35rem;
        }

        #esthell-birthday .eb-final h2 {
            font-size: 1.65rem;
        }

        #esthell-birthday .eb-hero,
        #esthell-birthday .eb-section,
        #esthell-birthday .eb-final {
            padding-left: 12px;
            padding-right: 12px;
        }

        #esthell-birthday .eb-grid,
        #esthell-birthday .eb-frame-card,
        #esthell-birthday .eb-sponsor-top,
        #esthell-birthday .eb-form-grid {
            grid-template-columns: 1fr;
        }

        #esthell-birthday .eb-frame-card img {
            width: min(260px, 100%);
        }

        #esthell-birthday .eb-button,
        #esthell-birthday .eb-form-actions .eb-button {
            width: 100%;
        }

    }

    @media (max-width: 520px) {
        #esthell-birthday .eb-facts,
        #esthell-birthday .eb-stats {
            grid-template-columns: 1fr;
        }

        #esthell-birthday .eb-countdown {
            gap: 5px;
        }

        #esthell-birthday .eb-time + .eb-time::before {
            margin-right: 5px;
        }

        #esthell-birthday .eb-time strong {
            font-size: 1.32rem;
        }

        #esthell-birthday .eb-time span {
            font-size: .72rem;
        }

        #esthell-birthday .eb-table th,
        #esthell-birthday .eb-table td {
            padding: 8px 6px;
            font-size: .9rem;
        }

        #esthell-birthday h1 {
            font-size: 1.82rem;
        }

        #esthell-birthday .eb-final h2 {
            font-size: 1.38rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        #esthell-birthday,
        #esthell-birthday * {
            animation: none !important;
            transition-duration: .01ms !important;
        }
    }
</style>

<div id="esthell-birthday" data-event-date="2026-05-13T13:00:00Z">
    <section class="eb-hero" aria-labelledby="esthell-title">
        <img class="eb-banner" src="/docs/assets/images/events/esthellbday/esthellbday-banner.png" alt="Esthell Birthday banner, May 13 at 1 PM GMT" width="2000" height="800" fetchpriority="high" decoding="async">

        <div class="eb-hero-copy">
            <h1 id="esthell-title">Esthell's Birthday</h1>
            <p>Join us on <strong>May 13 at 1 PM GMT</strong> for Esthell's birthday celebration. Come early, bring love, and stay ready for prizes.</p>
        </div>
    </section>

    <section class="eb-section" aria-labelledby="event-title">
        <div class="eb-section-head">
            <h2 id="event-title">Event Details</h2>
        </div>

        <div class="eb-grid">
            <div class="eb-card eb-event-card">
                <p>The birthday group opens on <strong>May 13 at 1 PM GMT</strong>. Invites and instructions will be shared before the event begins.</p>
                <div class="eb-facts">
                    <div class="eb-fact"><span>Date</span><strong>May 13</strong></div>
                    <div class="eb-fact"><span>Time</span><strong>1 PM GMT</strong></div>
                    <div class="eb-fact"><span>Guest</span><strong>esthell</strong></div>
                </div>
            </div>

            <div class="eb-card eb-countdown-card">
                <div class="eb-countdown" aria-live="polite">
                    <div class="eb-time"><strong data-days>00</strong><span>d</span></div>
                    <div class="eb-time"><strong data-hours>00</strong><span>h</span></div>
                    <div class="eb-time"><strong data-minutes>00</strong><span>m</span></div>
                    <div class="eb-time"><strong data-seconds>00</strong><span>s</span></div>
                </div>
            </div>
        </div>
    </section>

    <section class="eb-section" aria-labelledby="frame-title">
        <div class="eb-section-head">
            <h2 id="frame-title">Birthday Frame</h2>
        </div>

        <div class="eb-card eb-frame-card">
            <img src="/docs/assets/images/events/esthellbday/esthellbday-frame.png" alt="Esthell birthday frame preview" width="800" height="800" loading="lazy" decoding="async">
            <div class="eb-frame-copy">
                <p>Use the official Esthell birthday frame for the event and show up looking ready.</p>
                <a class="eb-button" href="/docs/assets/images/events/esthellbday/esthellbday-frame.png" download>Download Frame</a>
            </div>
        </div>
    </section>

    <section class="eb-section" id="sponsor-board" aria-labelledby="sponsor-title">
        <div class="eb-section-head">
            <h2 id="sponsor-title">Sponsors</h2>
        </div>

        <div class="eb-sponsor-top">
            <div class="eb-stats" aria-label="Sponsor summary">
                <div class="eb-stat"><span>Total</span><strong><span data-total-coins>0</span></strong></div>
                <div class="eb-stat"><span>Top</span><strong data-top-sponsor>Loading</strong></div>
                <div class="eb-stat"><span>Sponsors</span><strong data-sponsor-count>0</strong></div>
            </div>
            <button class="eb-button" type="button" data-open-sponsor>Sponsor Esthell</button>
        </div>

        <form class="eb-form" data-sponsor-form>
            <div class="eb-honeypot" aria-hidden="true">
                <label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
            </div>
            <div class="eb-form-grid">
                <label class="eb-field">
                    <span class="eb-label">Plato ID</span>
                    <input name="platoId" type="text" autocomplete="off" placeholder="esthell" required>
                </label>
                <label class="eb-field">
                    <span class="eb-label">Plato Invite Link</span>
                    <input name="inviteLink" type="url" inputmode="url" placeholder="https://platoapp.com/link/..." required>
                </label>
                <label class="eb-field">
                    <span class="eb-label">Sponsor Amount</span>
                    <input name="amount" type="text" inputmode="numeric" placeholder="50,000" required>
                </label>
            </div>
            <div class="eb-form-actions">
                <button class="eb-button" type="submit" data-submit-sponsor>Send Sponsor</button>
            </div>
            <p class="eb-form-status" data-form-status aria-live="polite"></p>
        </form>

        <table class="eb-table" id="esthell-sponsors">
            <colgroup>
                <col style="width:50%">
                <col style="width:50%">
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">Sponsor</th>
                    <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Risk</td><td>1,000,000</td></tr>
                <tr><td>Fear</td><td>300,000</td></tr>
                <tr><td>Dracula</td><td>200,000</td></tr>
                <tr><td>abc</td><td>100,000</td></tr>
                <tr><td>Tear</td><td>100,000</td></tr>
                <tr><td>7777777</td><td>100,000</td></tr>
                <tr><td>Fairy</td><td>100,000</td></tr>
                <tr><td>Mellissaaaa</td><td>50,000</td></tr>
                <tr><td>H22</td><td>50,000</td></tr>
                <tr><td>Nefya</td><td>50,000</td></tr>
                <tr><td>LA7</td><td>50,000</td></tr>
                <tr><td>YR_</td><td>50,000</td></tr>
                <tr><td>4DA</td><td>30,000</td></tr>
                <tr><td>Kikutie</td><td>30,000</td></tr>
                <tr><td>UniqueM_</td><td>30,000</td></tr>
                <tr><td>Aura</td><td>25,000</td></tr>
                <tr><td>Galaxy</td><td>20,000</td></tr>
                <tr><td>Spring</td><td>20,000</td></tr>
                <tr><td>Qear</td><td>20,000</td></tr>
                <tr><td>calisha</td><td>20,000</td></tr>
                <tr><td>888k</td><td>20,000</td></tr>
                <tr><td>amor</td><td>20,000</td></tr>
                <tr><td>Hades</td><td>20,000</td></tr>
                <tr><td>Diem17</td><td>15,000</td></tr>
                <tr><td>Sue</td><td>15,000</td></tr>
                <tr><td>Ruby</td><td>10,000</td></tr>
            </tbody>
        </table>
    </section>

    <section class="eb-final" aria-labelledby="final-title">
        <h2 id="final-title">Happy Birthday, Esthell</h2>
        <p>May 13 is your day. Arcade is showing up with love, prizes, and clean gold and emerald energy.</p>
    </section>
</div>

<script>
    (() => {
        const root = document.getElementById('esthell-birthday');
        if (!root) return;

        const WEBHOOK_URL = 'https://discord.com/api/webhooks/1501569265952882840/ex5wWeNRbqnqO__g0b8jEqy2Aom5VSyo-TTN0hkPuZsJ_RNZqJCSLL3EOOMCgl49yk2m';
        const numberFrom = value => parseInt(String(value || '').replace(/[^\d]/g, ''), 10) || 0;
        const format = value => value.toLocaleString('en-US');
        const pad = value => String(value).padStart(2, '0');

        const setupCountdown = () => {
            const target = new Date(root.dataset.eventDate || '2026-05-13T13:00:00Z').getTime();
            const days = root.querySelector('[data-days]');
            const hours = root.querySelector('[data-hours]');
            const minutes = root.querySelector('[data-minutes]');
            const seconds = root.querySelector('[data-seconds]');

            const tick = () => {
                const diff = target - Date.now();
                if (diff <= 0) {
                    days.textContent = '00';
                    hours.textContent = '00';
                    minutes.textContent = '00';
                    seconds.textContent = '00';
                    return;
                }

                const totalSeconds = Math.floor(diff / 1000);
                days.textContent = pad(Math.floor(totalSeconds / 86400));
                hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
                minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
                seconds.textContent = pad(totalSeconds % 60);
            };

            tick();
            setInterval(tick, 1000);
        };

        const setupSponsors = () => {
            const table = root.querySelector('#esthell-sponsors');
            const tbody = table && table.tBodies[0];
            if (!tbody) return;

            const rows = Array.from(tbody.rows).map(row => ({
                row,
                name: row.cells[0].textContent.trim(),
                amount: numberFrom(row.cells[1].textContent)
            }));

            rows.sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name));
            rows.forEach(item => tbody.appendChild(item.row));

            const total = rows.reduce((sum, item) => sum + item.amount, 0);
            root.querySelectorAll('[data-total-coins]').forEach(el => {
                el.textContent = format(total);
            });

            const top = rows[0];
            const topEl = root.querySelector('[data-top-sponsor]');
            const countEl = root.querySelector('[data-sponsor-count]');
            if (topEl) topEl.textContent = top ? top.name : 'None';
            if (countEl) countEl.textContent = String(rows.length);
        };

        const setupHaptics = () => {
            root.addEventListener('click', event => {
                const control = event.target.closest('button, .eb-button');
                if (!control || !root.contains(control) || control.disabled) return;
                if (navigator.vibrate) navigator.vibrate([28, 18, 34]);
            });
        };

        const setupSponsorForm = () => {
            const openButton = root.querySelector('[data-open-sponsor]');
            const form = root.querySelector('[data-sponsor-form]');
            const status = root.querySelector('[data-form-status]');
            const submit = root.querySelector('[data-submit-sponsor]');
            if (!openButton || !form || !status || !submit) return;

            const setFormOpen = open => {
                form.classList.toggle('is-open', open);
                openButton.textContent = open ? 'Hide Sponsor Form' : 'Sponsor Esthell';
                if (open) status.textContent = '';
            };

            openButton.addEventListener('click', () => {
                setFormOpen(!form.classList.contains('is-open'));
            });

            form.addEventListener('submit', async event => {
                event.preventDefault();
                const data = new FormData(form);
                if (String(data.get('website') || '').trim()) return;

                const platoId = String(data.get('platoId') || '').trim();
                const inviteLink = String(data.get('inviteLink') || '').trim();
                const amount = String(data.get('amount') || '').trim();

                if (!platoId || !inviteLink || !amount) {
                    status.textContent = 'Please fill in all sponsor fields.';
                    return;
                }

                const normalizedAmount = numberFrom(amount);
                const payload = {
                    username: 'Esthell Birthday Sponsors',
                    embeds: [{
                        title: 'New Esthell Birthday Sponsor',
                        color: 12093731,
                        fields: [
                            { name: 'Plato ID', value: platoId, inline: true },
                            { name: 'Sponsor Amount', value: normalizedAmount ? `${format(normalizedAmount)} coins` : amount, inline: true },
                            { name: 'Plato Invite Link', value: inviteLink, inline: false }
                        ],
                        timestamp: new Date().toISOString()
                    }]
                };

                submit.disabled = true;
                submit.textContent = 'Sending...';
                status.textContent = 'Sending sponsor request...';

                try {
                    const response = await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) throw new Error(`Discord returned ${response.status}`);

                    form.reset();
                    status.textContent = 'Sponsor request sent. Thank you!';
                } catch (error) {
                    status.textContent = 'Could not send right now. Please try again.';
                } finally {
                    submit.disabled = false;
                    submit.textContent = 'Send Sponsor';
                }
            });
        };

        root.addEventListener('contextmenu', event => {
            if (event.target.closest('img')) event.preventDefault();
        });

        setupCountdown();
        setupSponsors();
        setupHaptics();
        setupSponsorForm();
    })();
</script>
