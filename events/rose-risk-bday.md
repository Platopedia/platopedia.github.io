---
layout: tool-content
title: Rose & Risk's Birthday - Platopedia
heading: <img src="/docs/assets/images/events/rose-risk-bday/rose-risk-bday-logo.webp" />&nbsp;Rose & Risk's Birthday
---

<style>
    @import url("https://fonts.googleapis.com/css2?family=Marcellus+SC&family=Spectral:wght@500;600;700&family=Tangerine:wght@700&display=swap");

    #rose-risk-birthday {
        --rr-bg: #fbf4e8;
        --rr-surface: #fffaf1;
        --rr-surface-soft: #f0e3cf;
        --rr-text: #2b1715;
        --rr-muted: #705f58;
        --rr-line: #d2aa63;
        --rr-maroon: #7b1723;
        --rr-gold: #b37b31;
        --rr-shadow: rgba(47, 12, 15, .14);
        --rr-font-body: "Spectral", "Cormorant Garamond", "Palatino Linotype", Georgia, serif;
        --rr-font-heading: "Marcellus SC", "Cinzel", "Cormorant Garamond", Georgia, serif;
        --rr-font-script: "Tangerine", "Great Vibes", "Snell Roundhand", "Brush Script MT", cursive;
        width: 100%;
        max-width: 1080px;
        margin: 0 auto;
        color: var(--rr-text);
        font-family: var(--rr-font-body);
        background: var(--rr-bg);
        border: 1px solid var(--rr-line);
        border-radius: 8px;
        overflow: hidden;
    }

    body[data-theme="dark"] #rose-risk-birthday {
        --rr-bg: #130507;
        --rr-surface: #1f090d;
        --rr-surface-soft: #2b1015;
        --rr-text: #fff1cf;
        --rr-muted: rgba(255, 241, 207, .74);
        --rr-line: rgba(220, 177, 91, .32);
        --rr-maroon: #b02e3c;
        --rr-gold: #b37b31;
        --rr-shadow: rgba(0, 0, 0, .28);
    }

    #rose-risk-birthday,
    #rose-risk-birthday * {
        box-sizing: border-box;
    }

    #rose-risk-birthday img {
        display: block;
        max-width: 100%;
        height: auto;
        user-select: none;
        -webkit-user-drag: none;
    }

    #rose-risk-birthday :where(h2, p, strong, span, a, button, label, input, td, th) {
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    #rose-risk-birthday h2 {
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        color: inherit;
        background: none !important;
        box-shadow: none !important;
        letter-spacing: 0;
    }

    #rose-risk-birthday h2::before,
    #rose-risk-birthday h2::after {
        content: none !important;
        display: none !important;
    }

    #rose-risk-birthday p {
        margin: 0;
        color: var(--rr-muted);
        font-size: 1.08rem;
        line-height: 1.6;
    }

    #rose-risk-birthday strong {
        color: var(--rr-gold);
    }

    #rose-risk-birthday button,
    #rose-risk-birthday input {
        font: inherit;
    }

    #rose-risk-birthday button,
    #rose-risk-birthday a {
        touch-action: manipulation;
    }

    #rose-risk-birthday :focus-visible {
        outline: 3px solid var(--rr-gold);
        outline-offset: 3px;
    }

    #rose-risk-birthday .rr-hero {
        display: grid;
        gap: 18px;
        padding: 18px;
        background: var(--rr-bg);
    }

    #rose-risk-birthday .rr-banner {
        width: 100%;
        border: 1px solid var(--rr-line);
        border-radius: 8px;
        background: var(--rr-surface-soft);
        box-shadow: 0 16px 34px var(--rr-shadow);
    }

    #rose-risk-birthday .rr-hero-copy {
        display: grid;
        gap: 8px;
        max-width: 780px;
        margin: 0 auto;
        text-align: center;
    }

    #rose-risk-birthday .rr-section {
        padding: 22px 18px;
        border-top: 1px solid var(--rr-line);
    }

    #rose-risk-birthday .rr-section-head {
        margin-bottom: 14px;
    }

    #rose-risk-birthday h2 {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: var(--rr-maroon);
        font-family: var(--rr-font-heading);
        font-size: 1.55rem;
        font-weight: 700;
        line-height: 1.1;
    }

    #rose-risk-birthday h2::after {
        content: "" !important;
        display: block !important;
        width: 42px;
        height: 3px;
        border-radius: 999px;
        background: repeating-linear-gradient(90deg, var(--rr-gold) 0 12px, var(--rr-maroon) 12px 24px);
        background-size: 48px 100%;
        animation: rrAccentMove 2.4s linear infinite;
    }

    @keyframes rrAccentMove {
        to {
            background-position: 48px 0;
        }
    }

    #rose-risk-birthday .rr-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 14px;
        align-items: stretch;
    }

    #rose-risk-birthday .rr-card {
        border: 1px solid var(--rr-line);
        border-radius: 8px;
        background: var(--rr-surface);
        box-shadow: 0 12px 26px var(--rr-shadow);
        padding: 16px;
    }

    #rose-risk-birthday .rr-event-card {
        display: grid;
        gap: 14px;
    }

    #rose-risk-birthday .rr-facts {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    #rose-risk-birthday .rr-fact,
    #rose-risk-birthday .rr-stat {
        display: grid;
        align-content: center;
        justify-items: center;
        gap: 4px;
        min-height: 68px;
        padding: 10px;
        border: 1px solid var(--rr-line);
        border-radius: 8px;
        background: var(--rr-surface-soft);
        text-align: center;
    }

    #rose-risk-birthday .rr-label,
    #rose-risk-birthday .rr-fact span,
    #rose-risk-birthday .rr-stat span,
    #rose-risk-birthday .rr-time span {
        color: var(--rr-muted);
        font-family: var(--rr-font-heading);
        font-size: .78rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0;
    }

    #rose-risk-birthday .rr-fact strong,
    #rose-risk-birthday .rr-stat strong {
        color: var(--rr-gold);
        font-family: var(--rr-font-heading);
        font-size: 1.12rem;
        font-weight: 700;
        line-height: 1.1;
        font-variant-numeric: tabular-nums;
    }

    #rose-risk-birthday .rr-date-text {
        color: var(--rr-gold);
        font-family: inherit;
        font-size: inherit;
        font-weight: 700;
        line-height: inherit;
        font-feature-settings: "lnum" 1, "tnum" 1;
        font-variant-numeric: tabular-nums;
    }

    #rose-risk-birthday .rr-stat strong span {
        color: inherit;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        text-transform: none;
    }

    #rose-risk-birthday .rr-countdown-card {
        display: grid;
        align-content: center;
        justify-items: center;
        min-height: 100%;
        text-align: center;
    }

    #rose-risk-birthday .rr-countdown {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 8px;
        max-width: 100%;
        white-space: nowrap;
    }

    #rose-risk-birthday .rr-time {
        display: inline-flex;
        align-items: baseline;
        gap: 3px;
    }

    #rose-risk-birthday .rr-time + .rr-time::before {
        content: ":";
        margin-right: 8px;
        color: var(--rr-muted);
        font-weight: 900;
    }

    #rose-risk-birthday .rr-time strong {
        color: var(--rr-gold);
        font-family: var(--rr-font-heading);
        font-size: 1.7rem;
        font-weight: 700;
        line-height: 1;
        font-variant-numeric: tabular-nums;
    }

    #rose-risk-birthday .rr-time span {
        text-transform: lowercase;
    }

    #rose-risk-birthday .rr-invite-card {
        display: grid;
        gap: 14px;
    }

    #rose-risk-birthday .rr-invite-list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }

    #rose-risk-birthday .rr-invite-row {
        display: grid;
        gap: 10px;
        min-width: 0;
        padding: 14px;
        border: 1px solid var(--rr-line);
        border-radius: 8px;
        background: var(--rr-surface-soft);
    }

    #rose-risk-birthday .rr-invite-account {
        display: grid;
        gap: 3px;
    }

    #rose-risk-birthday .rr-invite-account strong {
        color: var(--rr-gold);
        font-family: var(--rr-font-heading);
        font-size: 1.16rem;
        line-height: 1.1;
    }

    #rose-risk-birthday .rr-invite-link {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        max-width: 100%;
        min-width: 0;
    }

    #rose-risk-birthday .rr-invite-link a {
        display: inline;
        flex: 1 1 auto;
        min-width: 0;
        max-width: 100%;
        color: var(--rr-maroon) !important;
        font-family: var(--rr-font-body);
        font-size: clamp(13px, 3.2vw, 15px);
        font-weight: 700;
        line-height: 1.3;
        overflow-wrap: anywhere;
        word-break: break-word;
        text-decoration: underline !important;
        text-decoration-color: currentColor;
        text-decoration-thickness: 1px;
        text-underline-offset: 3px;
        text-transform: none !important;
    }

    #rose-risk-birthday .rr-invite-link a:hover,
    #rose-risk-birthday .rr-invite-link a:active,
    #rose-risk-birthday .rr-invite-link a:focus-visible {
        color: var(--rr-gold) !important;
        text-decoration-thickness: 2px;
    }

    #rose-risk-birthday .rr-invite-link :where(button, [role="button"], [class*="copy"], [data-action*="copy"]) {
        position: relative;
        display: inline-flex !important;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        width: 30px;
        min-width: 30px;
        height: 30px;
        min-height: 30px;
        margin: 0 !important;
        padding: 0 !important;
        border: 1px solid var(--rr-line) !important;
        border-radius: 8px !important;
        background: var(--rr-surface) !important;
        color: var(--rr-maroon) !important;
        font-size: 0 !important;
        line-height: 1 !important;
        vertical-align: middle;
        cursor: pointer;
    }

    #rose-risk-birthday .rr-invite-link :where(button, [role="button"], [class*="copy"], [data-action*="copy"])::before,
    #rose-risk-birthday .rr-invite-link :where(button, [role="button"], [class*="copy"], [data-action*="copy"])::after {
        content: "";
        position: absolute;
        width: 11px;
        height: 13px;
        border: 1.7px solid currentColor;
        border-radius: 2px;
    }

    #rose-risk-birthday .rr-invite-link :where(button, [role="button"], [class*="copy"], [data-action*="copy"])::before {
        transform: translate(2px, 2px);
    }

    #rose-risk-birthday .rr-invite-link :where(button, [role="button"], [class*="copy"], [data-action*="copy"])::after {
        background: var(--rr-surface);
        transform: translate(-2px, -2px);
    }

    #rose-risk-birthday .rr-invite-link :where(button, [role="button"], [class*="copy"], [data-action*="copy"]):hover {
        color: var(--rr-gold) !important;
        transform: translateY(-1px);
    }

    #rose-risk-birthday .rr-frame-card {
        display: grid;
        grid-template-columns: 220px minmax(0, 1fr);
        gap: 18px;
        align-items: center;
    }

    #rose-risk-birthday .rr-frame-card img {
        width: 220px;
        justify-self: center;
        border: 1px solid var(--rr-line);
        border-radius: 8px;
        background: var(--rr-surface-soft);
    }

    #rose-risk-birthday .rr-frame-copy {
        display: grid;
        gap: 12px;
        align-content: center;
    }

    #rose-risk-birthday .rr-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        width: fit-content;
        max-width: 100%;
        padding: 10px 14px;
        border: 1px solid var(--rr-line);
        border-radius: 8px;
        background: var(--rr-gold);
        color: #241007 !important;
        font-family: var(--rr-font-heading);
        font-weight: 900;
        text-decoration: none !important;
        cursor: pointer;
        box-shadow: 0 8px 18px var(--rr-shadow);
        transition: transform .16s ease, box-shadow .16s ease, filter .16s ease;
    }

    #rose-risk-birthday .rr-button:hover {
        transform: translateY(-2px);
        filter: saturate(1.05);
        box-shadow: 0 12px 24px var(--rr-shadow);
    }

    #rose-risk-birthday .rr-button:active {
        transform: translateY(0);
    }

    #rose-risk-birthday .rr-button[disabled] {
        cursor: not-allowed;
        opacity: .65;
        transform: none;
    }

    #rose-risk-birthday .rr-sponsor-top {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 14px;
        align-items: center;
        margin-bottom: 14px;
    }

    #rose-risk-birthday .rr-stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    #rose-risk-birthday .rr-form {
        display: none;
        margin-bottom: 14px;
        padding: 14px;
        border: 1px solid var(--rr-line);
        border-radius: 8px;
        background: var(--rr-surface);
        box-shadow: 0 12px 26px var(--rr-shadow);
    }

    #rose-risk-birthday .rr-form.is-open {
        display: grid;
        gap: 10px;
    }

    #rose-risk-birthday .rr-form-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    #rose-risk-birthday .rr-field {
        display: grid;
        gap: 6px;
        min-width: 0;
    }

    #rose-risk-birthday .rr-field input {
        width: 100%;
        min-height: 42px;
        padding: 9px 10px;
        border: 1px solid var(--rr-line);
        border-radius: 8px;
        background: var(--rr-bg) !important;
        color: var(--rr-text) !important;
        -webkit-text-fill-color: var(--rr-text) !important;
        caret-color: var(--rr-maroon);
        appearance: none;
        -webkit-appearance: none;
    }

    #rose-risk-birthday .rr-field input::placeholder {
        color: var(--rr-muted) !important;
        -webkit-text-fill-color: var(--rr-muted) !important;
        opacity: .78;
    }

    #rose-risk-birthday .rr-field input:focus {
        border-color: var(--rr-maroon);
        box-shadow: 0 0 0 3px rgba(123, 23, 35, .18);
    }

    #rose-risk-birthday .rr-field input:-webkit-autofill,
    #rose-risk-birthday .rr-field input:-webkit-autofill:hover,
    #rose-risk-birthday .rr-field input:-webkit-autofill:focus {
        -webkit-text-fill-color: var(--rr-text) !important;
        box-shadow: 0 0 0 1000px var(--rr-bg) inset !important;
        transition: background-color 9999s ease-in-out 0s;
    }

    #rose-risk-birthday .rr-form-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: center;
        margin-top: 2px;
    }

    #rose-risk-birthday .rr-honeypot {
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }

    #rose-risk-birthday .rr-form-status {
        margin: 0;
        color: var(--rr-maroon);
        font-weight: 800;
        text-align: center;
    }

    #rose-risk-birthday .rr-form-status:empty {
        display: none;
    }

    #rose-risk-birthday .rr-table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        border: 1px solid var(--rr-line);
        border-radius: 8px;
        overflow: hidden;
        background: var(--rr-surface);
        box-shadow: 0 12px 26px var(--rr-shadow);
    }

    #rose-risk-birthday .rr-table th,
    #rose-risk-birthday .rr-table td {
        width: 50%;
        padding: 9px 10px;
        border-bottom: 1px solid var(--rr-line);
        color: var(--rr-text);
        line-height: 1.25;
        text-align: center;
        vertical-align: middle;
    }

    #rose-risk-birthday .rr-table th {
        color: #241007;
        background: var(--rr-gold);
        font-family: var(--rr-font-heading);
        font-weight: 900;
    }

    #rose-risk-birthday .rr-table td:last-child {
        font-variant-numeric: tabular-nums;
    }

    #rose-risk-birthday .rr-table tbody tr:nth-child(even) {
        background: var(--rr-surface-soft);
    }

    #rose-risk-birthday .rr-final {
        padding: 24px 18px 28px;
        border-top: 1px solid var(--rr-line);
        text-align: center;
        background: var(--rr-surface-soft);
    }

    #rose-risk-birthday .rr-final h2 {
        display: block;
        width: 100%;
        color: var(--rr-gold);
        font-family: var(--rr-font-script);
        font-size: 2.6rem;
        font-style: normal;
        font-weight: 400;
        line-height: 1.08;
        text-transform: none;
        text-shadow: none;
        text-align: center !important;
    }

    #rose-risk-birthday .rr-final #final-title::after {
        content: none !important;
        display: none !important;
        width: 0 !important;
        height: 0 !important;
        background: none !important;
    }

    #rose-risk-birthday .rr-final p {
        max-width: 520px;
        margin: 8px auto 0;
        color: var(--rr-muted);
        font-family: inherit;
        font-size: 1.06rem;
        font-style: normal;
        line-height: 1.55;
        text-align: center;
    }

    @media (max-width: 820px) {
        #rose-risk-birthday {
            border-radius: 0;
            border-left: 0;
            border-right: 0;
        }

        #rose-risk-birthday h2 {
            font-size: 1.35rem;
        }

        #rose-risk-birthday .rr-final h2 {
            font-size: 2.25rem;
        }

        #rose-risk-birthday .rr-hero,
        #rose-risk-birthday .rr-section,
        #rose-risk-birthday .rr-final {
            padding-left: 12px;
            padding-right: 12px;
        }

        #rose-risk-birthday .rr-grid,
        #rose-risk-birthday .rr-frame-card,
        #rose-risk-birthday .rr-sponsor-top,
        #rose-risk-birthday .rr-form-grid,
        #rose-risk-birthday .rr-invite-list {
            grid-template-columns: 1fr;
        }

        #rose-risk-birthday .rr-frame-card img {
            width: min(260px, 100%);
        }

        #rose-risk-birthday .rr-button,
        #rose-risk-birthday .rr-form-actions .rr-button {
            width: 100%;
        }

    }

    @media (max-width: 520px) {
        #rose-risk-birthday .rr-facts,
        #rose-risk-birthday .rr-stats {
            grid-template-columns: 1fr;
        }

        #rose-risk-birthday .rr-countdown {
            gap: 5px;
        }

        #rose-risk-birthday .rr-time + .rr-time::before {
            margin-right: 5px;
        }

        #rose-risk-birthday .rr-time strong {
            font-size: 1.32rem;
        }

        #rose-risk-birthday .rr-time span {
            font-size: .72rem;
        }

        #rose-risk-birthday .rr-table th,
        #rose-risk-birthday .rr-table td {
            padding: 8px 6px;
            font-size: .9rem;
        }

        #rose-risk-birthday .rr-final h2 {
            font-size: 2rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        #rose-risk-birthday,
        #rose-risk-birthday * {
            animation: none !important;
            transition-duration: .01ms !important;
        }
    }
</style>

<div id="rose-risk-birthday" data-event-date="2026-06-06T13:00:00Z">
    <section class="rr-hero" aria-label="Rose and Risk birthday introduction">
        <img class="rr-banner" src="/docs/assets/images/events/rose-risk-bday/rose-risk-bday-banner.webp" alt="Rose and Risk Birthday banner, June 6 at 1 PM GMT" width="1920" height="768" fetchpriority="high" decoding="async">

        <div class="rr-hero-copy">
            <p>Arcade is throwing a joint birthday party for <strong>Rose & Risk</strong> on <strong class="rr-date-text">June 6 at 1 PM GMT!</strong> It's a massive event you won't want to miss. Bring your best energy for a day packed with prizes and good vibes. Check below for the party group invite.</p>
        </div>
    </section>

    <section class="rr-section" aria-labelledby="event-title">
        <div class="rr-section-head">
            <h2 id="event-title">Event Details</h2>
        </div>

        <div class="rr-grid">
            <div class="rr-card rr-event-card">
                <div class="rr-facts">
                    <div class="rr-fact"><span>Date</span><strong>June 6</strong></div>
                    <div class="rr-fact"><span>Time</span><strong>1 PM GMT</strong></div>
                    <div class="rr-fact"><span>Location</span><strong>Party Group</strong></div>
                </div>
            </div>

            <div class="rr-card rr-countdown-card">
                <div class="rr-countdown" aria-live="polite">
                    <div class="rr-time"><strong data-days>00</strong><span>d</span></div>
                    <div class="rr-time"><strong data-hours>00</strong><span>h</span></div>
                    <div class="rr-time"><strong data-minutes>00</strong><span>m</span></div>
                    <div class="rr-time"><strong data-seconds>00</strong><span>s</span></div>
                </div>
            </div>
        </div>
    </section>

    <section class="rr-section" aria-labelledby="invite-title">
        <div class="rr-section-head">
            <h2 id="invite-title">Group Invite</h2>
        </div>

        <div class="rr-card rr-invite-card">
            <p>Book your spot for the giveaway by adding one of these accounts. An invite will be sent on the event day. Please add only one account.</p>

            <div class="rr-invite-list">
                <div class="rr-invite-row">
                    <div class="rr-invite-account">
                        <span class="rr-label">Invite Account</span>
                        <strong>@PartyBot</strong>
                    </div>
                    <span class="content-link rr-invite-link" data-url="https://platoapp.com/link/o69ig53gckal" data-text="https://platoapp.com/link/i2td55798awk" data-copy="true"></span>
                </div>

                <div class="rr-invite-row">
                    <div class="rr-invite-account">
                        <span class="rr-label">Invite Account</span>
                        <strong>@PartyBot2</strong>
                    </div>
                    <span class="content-link rr-invite-link" data-url="https://platoapp.com/link/olty6mwzykeh" data-text="https://platoapp.com/link/ipgzh37itx48" data-copy="true"></span>
                </div>

                <div class="rr-invite-row">
                    <div class="rr-invite-account">
                        <span class="rr-label">Invite Account</span>
                        <strong>@PartyBot3</strong>
                    </div>
                    <span class="content-link rr-invite-link" data-url="https://platoapp.com/link/2hs9w2hw5ys8l" data-text="https://platoapp.com/link/e4vwnbw4vl7a" data-copy="true"></span>
                </div>
            </div>
        </div>
    </section>

    <section class="rr-section" id="frame" aria-labelledby="frame-title">
        <div class="rr-section-head">
            <h2 id="frame-title">Birthday Frame</h2>
        </div>

        <div class="rr-card rr-frame-card">
            <img src="/docs/assets/images/events/rose-risk-bday/rose-risk-bday-frame.png" alt="Rose and Risk birthday frame preview" width="800" height="800" loading="lazy" decoding="async">
            <div class="rr-frame-copy">
                <p><strong>Mandatory:</strong> Put on the Rose and Risk birthday frame before joining the celebration.</p>
                <a class="rr-button" href="/docs/assets/images/events/rose-risk-bday/rose-risk-bday-frame.png" download>Download Frame</a>
            </div>
        </div>
    </section>

    <section class="rr-section" id="sponsor-board" aria-labelledby="sponsor-title">
        <div class="rr-section-head">
            <h2 id="sponsor-title">Sponsors</h2>
        </div>

        <div class="rr-sponsor-top">
            <div class="rr-stats" aria-label="Sponsor summary">
                <div class="rr-stat"><span>Total</span><strong><span data-total-coins>0</span></strong></div>
                <div class="rr-stat"><span>Top</span><strong data-top-sponsor>Loading</strong></div>
                <div class="rr-stat"><span>Sponsors</span><strong data-sponsor-count>0</strong></div>
            </div>
            <button class="rr-button" type="button" data-open-sponsor>Sponsor For Rose &amp; Risk</button>
        </div>

        <form class="rr-form" data-sponsor-form>
            <div class="rr-honeypot" aria-hidden="true">
                <label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
            </div>
            <div class="rr-form-grid">
                <label class="rr-field">
                    <span class="rr-label">Plato ID</span>
                    <input name="platoId" type="text" autocomplete="off" placeholder="Enter your Plato ID" required>
                </label>
                <label class="rr-field">
                    <span class="rr-label">Plato Invite Link</span>
                    <input name="inviteLink" type="url" inputmode="url" placeholder="https://platoapp.com/link/..." required>
                </label>
                <label class="rr-field">
                    <span class="rr-label">Sponsor Amount</span>
                    <input name="amount" type="text" inputmode="numeric" placeholder="Enter amount in Coins" required>
                </label>
            </div>
            <div class="rr-form-actions">
                <button class="rr-button" type="submit" data-submit-sponsor>Send Sponsor</button>
            </div>
            <p class="rr-form-status" data-form-status aria-live="polite"></p>
        </form>

        <table class="rr-table" id="rose-risk-sponsors">
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
                <tr><td>Fear</td><td>250,000</td></tr>
                <tr><td>YYY</td><td>150,000</td></tr>
                <tr><td>Fairy</td><td>125,000</td></tr>
                <tr><td>esthell</td><td>100,000</td></tr>
                <tr><td>Risk</td><td>100,000</td></tr>
                <tr><td>Meowde</td><td>85,000</td></tr>
                <tr><td>Rivings</td><td>75,000</td></tr>
                <tr><td>Nefya</td><td>50,000</td></tr>
                <tr><td>Frequency</td><td>50,000</td></tr>
                <tr><td>Arts</td><td>35,000</td></tr>
                <tr><td>Aura</td><td>25,000</td></tr>
                <tr><td>zos</td><td>25,000</td></tr>
                <tr><td>MADIIROSE</td><td>10,000</td></tr>
            </tbody>
        </table>
    </section>

    <section class="rr-final" aria-labelledby="final-title">
        <h2 id="final-title">Happy Birthday, Rose &amp; Risk</h2>
        <p>On June 6, we get to celebrate and appreciate all that you are, because without you, Arcade wouldn't be the same - or even exist. The influence you two have on our community is nothing short of amazing. Thank you for everything, absolute legends.</p>
    </section>
</div>

<script>
    (() => {
        const root = document.getElementById('rose-risk-birthday');
        if (!root) return;

        const WEBHOOK_URL = 'https://discord.com/api/webhooks/1511006655762927647/cn_XQvtcaUAEyL4CCpF_wWKx1gA8d0_4hi8uroxePhn7apE2ATuaM5bCrc3MmsEYAVwe';
        const numberFrom = value => parseInt(String(value || '').replace(/[^\d]/g, ''), 10) || 0;
        const format = value => value.toLocaleString('en-US');
        const pad = value => String(value).padStart(2, '0');

        const setupCountdown = () => {
            const target = new Date(root.dataset.eventDate || '2026-06-06T13:00:00Z').getTime();
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
            const table = root.querySelector('#rose-risk-sponsors');
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
                const control = event.target.closest('button, .rr-button');
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
                openButton.textContent = open ? 'Hide Sponsor Form' : 'Sponsor For Rose & Risk';
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
                    username: 'Rose & Risk Birthday Sponsors',
                    embeds: [{
                        title: 'New Rose & Risk Birthday Sponsor',
                        color: 12422959,
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
