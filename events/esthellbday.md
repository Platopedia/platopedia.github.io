---
layout: tool-content
title: Esthell's Birthday - Platopedia
heading: Esthell's Birthday
---

<style>
    html:has(#esthell-birthday),
    body:has(#esthell-birthday) {
        background: #02110d !important;
        overflow-x: hidden;
    }

    #esthell-birthday {
        --eb-ink: #031812;
        --eb-deep: #06291f;
        --eb-emerald: #0b6f4c;
        --eb-emerald-2: #18a86f;
        --eb-gold: #d8ad43;
        --eb-gold-2: #ffe39b;
        --eb-cream: #fff8df;
        --eb-soft: rgba(255, 248, 223, .82);
        --eb-line: rgba(255, 227, 155, .34);
        --eb-shadow: rgba(0, 0, 0, .3);
        position: relative;
        left: 50%;
        width: 100vw;
        max-width: 100vw;
        margin: 0 0 0 -50vw;
        color: var(--eb-cream) !important;
        background:
            linear-gradient(90deg, rgba(255, 227, 155, .07) 1px, transparent 1px),
            linear-gradient(180deg, var(--eb-ink), var(--eb-deep) 48%, #02110d);
        background-size: 24px 24px, auto;
        border: 1px solid var(--eb-line);
        overflow: hidden;
        overflow-x: hidden;
        box-shadow: 0 0 0 100vmax #02110d;
        clip-path: inset(0 -100vmax -100vmax -100vmax);
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

    #esthell-birthday h1,
    #esthell-birthday h2,
    #esthell-birthday h3,
    #esthell-birthday p {
        margin: 0;
    }

    #esthell-birthday p {
        color: var(--eb-soft) !important;
        line-height: 1.58;
    }

    #esthell-birthday p strong {
        color: var(--eb-gold-2) !important;
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
        outline: 3px solid var(--eb-gold-2);
        outline-offset: 3px;
    }

    #esthell-birthday .eb-hero {
        padding: 16px;
        background:
            linear-gradient(135deg, rgba(216, 173, 67, .12), rgba(24, 168, 111, .12)),
            rgba(0, 0, 0, .12);
        border-bottom: 1px solid var(--eb-line);
    }

    #esthell-birthday .eb-banner {
        border: 1px solid rgba(255, 227, 155, .62);
        border-radius: 8px;
        box-shadow: 0 22px 44px var(--eb-shadow);
        background: #06291f;
    }

    #esthell-birthday .eb-intro {
        display: grid;
        gap: 10px;
        padding: 18px 4px 2px;
        text-align: center;
    }

    #esthell-birthday .eb-kicker {
        color: var(--eb-gold-2) !important;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0;
    }

    #esthell-birthday h1 {
        font-size: 3rem;
        line-height: 1.05;
        letter-spacing: 0;
        color: var(--eb-gold-2) !important;
        -webkit-text-fill-color: var(--eb-gold-2) !important;
        text-shadow: 0 0 18px rgba(24, 168, 111, .34), 0 0 10px rgba(216, 173, 67, .28);
        animation: ebTitleGlow 3.8s ease-in-out infinite;
    }

    #esthell-birthday .eb-lede {
        max-width: 700px;
        margin: 0 auto;
        font-size: 1.05rem;
    }

    #esthell-birthday .eb-section {
        padding: 22px 16px;
        border-bottom: 1px solid rgba(255, 227, 155, .2);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, .035), rgba(0, 0, 0, .075)),
            linear-gradient(90deg, rgba(216, 173, 67, .05), rgba(24, 168, 111, .07));
    }

    #esthell-birthday .eb-title {
        margin-bottom: 14px;
    }

    #esthell-birthday .eb-title-chip {
        display: inline-flex;
        align-items: center;
        min-height: 0;
        max-width: 100%;
        padding: 8px 10px !important;
        border: 1px solid rgba(255, 227, 155, .28);
        border-radius: 8px;
        margin: 0 !important;
        background: linear-gradient(135deg, rgba(6, 41, 31, .92), rgba(11, 111, 76, .58), rgba(216, 173, 67, .14));
        background-size: 220% 100%;
        box-shadow: 0 10px 22px rgba(0, 0, 0, .18);
        line-height: 1.08 !important;
        font-size: inherit !important;
        animation: ebChipShine 4.2s linear infinite;
    }

    #esthell-birthday .eb-title-text {
        font-size: 1.9rem;
        line-height: 1.08;
        letter-spacing: 0;
        color: var(--eb-gold-2) !important;
        -webkit-text-fill-color: var(--eb-gold-2) !important;
        text-shadow: 0 0 14px rgba(24, 168, 111, .34), 0 0 8px rgba(216, 173, 67, .24);
        animation: ebTitleGlow 3.8s ease-in-out infinite;
    }

    @keyframes ebChipShine {
        to {
            background-position: 220% 50%;
        }
    }

    @keyframes ebTitleGlow {
        50% {
            color: var(--eb-gold) !important;
            -webkit-text-fill-color: var(--eb-gold) !important;
            text-shadow: 0 0 20px rgba(24, 168, 111, .46), 0 0 12px rgba(216, 173, 67, .34);
        }
    }

    #esthell-birthday .eb-card,
    #esthell-birthday .eb-frame-card,
    #esthell-birthday .eb-form {
        border: 1px solid rgba(255, 227, 155, .3);
        border-radius: 8px;
        background:
            linear-gradient(180deg, rgba(255, 248, 223, .08), rgba(255, 248, 223, .025)),
            rgba(3, 24, 18, .5);
        box-shadow: 0 14px 28px rgba(0, 0, 0, .18);
    }

    #esthell-birthday .eb-event-grid {
        display: block;
    }

    #esthell-birthday .eb-card {
        padding: 16px;
    }

    #esthell-birthday .eb-event-card {
        display: grid;
        grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
        gap: 14px;
        align-items: center;
    }

    #esthell-birthday .eb-event-card > * {
        min-width: 0;
    }

    #esthell-birthday .eb-event-copy {
        display: grid;
        gap: 9px;
    }

    #esthell-birthday .eb-event-copy p {
        font-size: .98rem;
    }

    #esthell-birthday .eb-card h3 {
        margin-bottom: 8px;
        color: var(--eb-gold-2) !important;
        font-size: 1.12rem;
        line-height: 1.15;
        letter-spacing: 0;
    }

    #esthell-birthday .eb-facts {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        margin-top: 0;
    }

    #esthell-birthday .eb-fact {
        min-height: 58px;
        display: grid;
        align-content: center;
        gap: 4px;
        padding: 8px;
        border: 1px solid rgba(255, 227, 155, .24);
        border-radius: 8px;
        background: rgba(0, 0, 0, .16);
        text-align: center;
    }

    #esthell-birthday .eb-label,
    #esthell-birthday .eb-fact span,
    #esthell-birthday .eb-stat span {
        color: rgba(255, 248, 223, .7) !important;
        font-size: .78rem;
        font-weight: 800;
        letter-spacing: 0;
        text-transform: uppercase;
    }

    #esthell-birthday .eb-fact strong,
    #esthell-birthday .eb-stat strong {
        color: var(--eb-gold-2) !important;
        font-size: 1.12rem;
        line-height: 1.1;
        font-variant-numeric: tabular-nums;
    }

    body[data-theme="light"] #esthell-birthday {
        color: var(--eb-cream) !important;
        background:
            linear-gradient(90deg, rgba(255, 227, 155, .07) 1px, transparent 1px),
            linear-gradient(180deg, var(--eb-ink), var(--eb-deep) 48%, #02110d) !important;
    }

    body[data-theme="light"] #esthell-birthday :where(p, td, input) {
        color: var(--eb-soft) !important;
    }

    body[data-theme="light"] #esthell-birthday .eb-field input {
        border-color: rgba(255, 227, 155, .46) !important;
        background: #041c15 !important;
        background-color: #041c15 !important;
        color: var(--eb-cream) !important;
        -webkit-text-fill-color: var(--eb-cream) !important;
    }

    body[data-theme="light"] #esthell-birthday .eb-field input::placeholder {
        color: rgba(255, 248, 223, .58) !important;
        -webkit-text-fill-color: rgba(255, 248, 223, .58) !important;
    }

    body[data-theme="light"] #esthell-birthday :where(.eb-kicker, h1, .eb-title-text, .eb-card h3, .eb-fact strong, .eb-stat strong, .eb-time strong, .eb-note, .eb-form-status, .eb-final h2) {
        color: var(--eb-gold-2) !important;
        -webkit-text-fill-color: var(--eb-gold-2) !important;
    }

    body[data-theme="light"] #esthell-birthday :where(.eb-label, .eb-fact span, .eb-stat span, .eb-time span) {
        color: rgba(255, 248, 223, .7) !important;
    }

    #esthell-birthday .eb-countdown {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        margin-top: 0;
        max-width: 100%;
        min-width: 0;
        overflow: hidden;
        white-space: nowrap;
    }

    #esthell-birthday .eb-countdown-wrap {
        padding: 12px 14px;
        max-width: 100%;
        min-width: 0;
        overflow: hidden;
        border: 1px solid rgba(255, 227, 155, .24);
        border-radius: 8px;
        background:
            linear-gradient(180deg, rgba(255, 248, 223, .08), rgba(255, 248, 223, .025)),
            rgba(0, 0, 0, .16);
    }

    #esthell-birthday .eb-time {
        min-height: 0;
        display: inline-flex;
        align-items: baseline;
        justify-content: center;
        gap: 3px;
        min-width: 0;
        padding: 0;
        border: 0;
        border-radius: 0;
        background: transparent;
    }

    #esthell-birthday .eb-time + .eb-time {
        border-left: 0;
    }

    #esthell-birthday .eb-time + .eb-time::before {
        content: ":";
        margin-right: 7px;
        color: rgba(255, 248, 223, .5);
        font-weight: 900;
    }

    #esthell-birthday .eb-time strong {
        color: var(--eb-gold-2) !important;
        font-size: 1.38rem;
        line-height: 1;
        font-variant-numeric: tabular-nums;
    }

    #esthell-birthday .eb-time span {
        color: rgba(255, 248, 223, .7) !important;
        font-size: .82rem;
        font-weight: 900;
        text-transform: lowercase;
    }

    #esthell-birthday .eb-note {
        margin-top: 8px;
        color: var(--eb-gold-2) !important;
        font-size: .92rem;
        font-weight: 900;
        text-align: center;
    }

    #esthell-birthday .eb-frame-card {
        display: grid;
        grid-template-columns: 220px minmax(0, 1fr);
        gap: 16px;
        align-items: center;
        padding: 16px;
    }

    #esthell-birthday .eb-frame-card img {
        width: 220px;
        border: 2px solid rgba(255, 227, 155, .48);
        border-radius: 8px;
        background: rgba(0, 0, 0, .18);
    }

    #esthell-birthday .eb-frame-copy {
        display: grid;
        gap: 10px;
    }

    #esthell-birthday .eb-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        width: fit-content;
        max-width: 100%;
        padding: 10px 14px;
        border: 1px solid rgba(255, 227, 155, .58);
        border-radius: 8px;
        background: linear-gradient(135deg, var(--eb-gold-2), var(--eb-gold) 56%, var(--eb-emerald-2));
        color: #031812 !important;
        font-weight: 950;
        text-decoration: none !important;
        cursor: pointer;
        box-shadow: 0 10px 22px rgba(0, 0, 0, .22);
        transition: transform .16s ease, filter .16s ease, box-shadow .16s ease;
    }

    #esthell-birthday .eb-button-soft {
        background: linear-gradient(135deg, rgba(6, 41, 31, .94), rgba(11, 111, 76, .72));
        color: var(--eb-gold-2) !important;
    }

    #esthell-birthday .eb-button:hover {
        transform: translateY(-2px);
        filter: saturate(1.08);
        box-shadow: 0 14px 26px rgba(0, 0, 0, .28);
    }

    #esthell-birthday .eb-button:active {
        transform: translateY(0);
    }

    #esthell-birthday .eb-button[disabled] {
        opacity: .7;
        cursor: not-allowed;
        transform: none;
    }

    #esthell-birthday .eb-sponsor-top {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 14px;
        align-items: center;
        margin-bottom: 14px;
    }

    #esthell-birthday .eb-stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
    }

    #esthell-birthday .eb-stat {
        min-height: 72px;
        display: grid;
        align-content: center;
        gap: 4px;
        padding: 10px;
        border: 1px solid rgba(255, 227, 155, .24);
        border-radius: 8px;
        background: rgba(0, 0, 0, .16);
    }

    #esthell-birthday .eb-form {
        display: none;
        margin-bottom: 14px;
        padding: 14px;
    }

    #esthell-birthday .eb-form.is-open {
        display: block;
    }

    #esthell-birthday .eb-form-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr)) auto auto;
        gap: 10px;
        align-items: end;
    }

    #esthell-birthday .eb-field {
        display: grid;
        gap: 6px;
        min-width: 0;
    }

    #esthell-birthday .eb-field input {
        width: 100%;
        min-height: 42px;
        border: 1px solid rgba(255, 227, 155, .42);
        border-radius: 8px;
        background: rgba(0, 0, 0, .34) !important;
        background-color: rgba(0, 0, 0, .34) !important;
        color: var(--eb-cream) !important;
        -webkit-text-fill-color: var(--eb-cream) !important;
        caret-color: var(--eb-gold-2);
        padding: 9px 10px;
        box-shadow: inset 0 0 0 1px rgba(24, 168, 111, .12);
        appearance: none;
        -webkit-appearance: none;
    }

    #esthell-birthday .eb-field input::placeholder {
        color: rgba(255, 248, 223, .58) !important;
        -webkit-text-fill-color: rgba(255, 248, 223, .58) !important;
        opacity: 1;
    }

    #esthell-birthday .eb-field input:focus {
        border-color: rgba(255, 227, 155, .78);
        background: rgba(0, 0, 0, .42) !important;
        background-color: rgba(0, 0, 0, .42) !important;
        box-shadow: inset 0 0 0 1px rgba(255, 227, 155, .18), 0 0 0 3px rgba(216, 173, 67, .16);
    }

    #esthell-birthday .eb-field input:-webkit-autofill,
    #esthell-birthday .eb-field input:-webkit-autofill:hover,
    #esthell-birthday .eb-field input:-webkit-autofill:focus {
        border-color: rgba(255, 227, 155, .58);
        -webkit-text-fill-color: var(--eb-cream) !important;
        caret-color: var(--eb-gold-2);
        box-shadow: 0 0 0 1000px #041c15 inset, inset 0 0 0 1px rgba(24, 168, 111, .18) !important;
        transition: background-color 9999s ease-in-out 0s;
    }

    #esthell-birthday .eb-honeypot {
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }

    #esthell-birthday .eb-form-status {
        min-height: 22px;
        margin-top: 10px;
        color: var(--eb-gold-2) !important;
        font-weight: 800;
    }

    #esthell-birthday .eb-table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        border: 1px solid rgba(255, 227, 155, .28);
        border-radius: 8px;
        overflow: hidden;
        background: rgba(3, 24, 18, .48);
    }

    #esthell-birthday .eb-table th,
    #esthell-birthday .eb-table td {
        padding: 8px 10px;
        border-bottom: 1px solid rgba(255, 227, 155, .16);
        color: var(--eb-soft) !important;
        line-height: 1.25;
        text-align: center;
        vertical-align: middle;
    }

    #esthell-birthday .eb-table th {
        color: #031812 !important;
        background: linear-gradient(135deg, var(--eb-gold-2), var(--eb-gold));
        font-weight: 950;
    }

    #esthell-birthday .eb-table th:first-child,
    #esthell-birthday .eb-table td:first-child {
        width: 50%;
    }

    #esthell-birthday .eb-table th:last-child,
    #esthell-birthday .eb-table td:last-child {
        width: 50%;
        font-variant-numeric: tabular-nums;
    }

    #esthell-birthday .eb-table tbody tr:nth-child(even) {
        background: rgba(255, 248, 223, .035);
    }

    #esthell-birthday .eb-final {
        padding: 24px 16px 28px;
        text-align: center;
        background: linear-gradient(180deg, rgba(216, 173, 67, .12), rgba(11, 111, 76, .2));
    }

    #esthell-birthday .eb-final h2 {
        color: var(--eb-gold-2) !important;
        font-size: 1.8rem;
        line-height: 1.1;
        letter-spacing: 0;
    }

    #esthell-birthday .eb-final p {
        max-width: 650px;
        margin: 10px auto 0;
    }

    @media (max-width: 820px) {
        #esthell-birthday h1 {
            font-size: 2.35rem;
        }

        #esthell-birthday .eb-event-card,
        #esthell-birthday .eb-frame-card,
        #esthell-birthday .eb-sponsor-top,
        #esthell-birthday .eb-form-grid {
            grid-template-columns: 1fr;
        }

        #esthell-birthday .eb-frame-card img,
        #esthell-birthday .eb-button {
            width: 100%;
        }

        #esthell-birthday .eb-frame-card img {
            max-width: 320px;
            justify-self: center;
        }
    }

    @media (max-width: 540px) {
        #esthell-birthday {
            border-left: 0;
            border-right: 0;
        }

        #esthell-birthday .eb-hero,
        #esthell-birthday .eb-section,
        #esthell-birthday .eb-final {
            padding-left: 10px;
            padding-right: 10px;
        }

        #esthell-birthday h1 {
            font-size: 1.95rem;
        }

        #esthell-birthday .eb-title-text {
            font-size: 1.45rem;
        }

        #esthell-birthday .eb-facts,
        #esthell-birthday .eb-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        #esthell-birthday .eb-table th,
        #esthell-birthday .eb-table td {
            padding: 7px 6px;
            font-size: .88rem;
        }

        #esthell-birthday .eb-countdown-wrap {
            padding: 10px 8px;
        }

        #esthell-birthday .eb-countdown {
            gap: 5px;
        }

        #esthell-birthday .eb-time + .eb-time::before {
            margin-right: 5px;
        }

        #esthell-birthday .eb-time strong {
            font-size: 1.22rem;
        }

        #esthell-birthday .eb-time span {
            font-size: .72rem;
        }
    }

    @media (max-width: 360px) {
        #esthell-birthday .eb-facts,
        #esthell-birthday .eb-stats {
            grid-template-columns: 1fr;
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

        <div class="eb-intro">
            <p class="eb-kicker">Arcade Birthday Event</p>
            <h1 id="esthell-title">Esthell's Birthday</h1>
            <p class="eb-lede">Join us on <strong>May 13 at 1 PM GMT</strong> for Esthell's birthday celebration. Come early, bring love, and stay ready for prizes.</p>
        </div>
    </section>

    <section class="eb-section" aria-labelledby="event-title">
        <div class="eb-title">
            <h2 class="eb-title-chip"><span class="eb-title-text" id="event-title">Event Details</span></h2>
        </div>

        <div class="eb-event-grid">
            <div class="eb-card eb-event-card">
                <div class="eb-event-copy">
                    <p>The birthday group opens on <strong>May 13 at 1 PM GMT</strong>. Invites and instructions will be shared before the event begins.</p>
                    <div class="eb-facts">
                        <div class="eb-fact"><span>Date</span><strong>May 13</strong></div>
                        <div class="eb-fact"><span>Time</span><strong>1 PM GMT</strong></div>
                        <div class="eb-fact"><span>Guest</span><strong>esthell</strong></div>
                    </div>
                </div>

                <div class="eb-countdown-wrap">
                    <div class="eb-countdown" aria-live="polite">
                        <div class="eb-time"><strong data-days>00</strong><span>d</span></div>
                        <div class="eb-time"><strong data-hours>00</strong><span>h</span></div>
                        <div class="eb-time"><strong data-minutes>00</strong><span>m</span></div>
                        <div class="eb-time"><strong data-seconds>00</strong><span>s</span></div>
                    </div>
                    <p class="eb-note" data-countdown-note>May 13, 2026 - 1 PM GMT</p>
                </div>
            </div>
        </div>
    </section>

    <section class="eb-section" aria-labelledby="frame-title">
        <div class="eb-title">
            <h2 class="eb-title-chip"><span class="eb-title-text" id="frame-title">Birthday Frame</span></h2>
        </div>

        <div class="eb-frame-card">
            <img src="/docs/assets/images/events/esthellbday/esthellbday-frame.png" alt="Esthell birthday frame preview" width="800" height="800" loading="lazy" decoding="async">
            <div class="eb-frame-copy">
                <p>Use the official Esthell birthday frame for the event and show up looking ready.</p>
                <a class="eb-button" href="/docs/assets/images/events/esthellbday/esthellbday-frame.png" download>Download Frame</a>
            </div>
        </div>
    </section>

    <section class="eb-section" id="sponsor-board" aria-labelledby="sponsor-title">
        <div class="eb-title">
            <h2 class="eb-title-chip"><span class="eb-title-text" id="sponsor-title">Sponsors</span></h2>
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
                <button class="eb-button" type="submit" data-submit-sponsor>Send Sponsor</button>
                <button class="eb-button eb-button-soft" type="button" data-close-sponsor>Hide</button>
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
        <p>May 13 is your day. Arcade is showing up with love, prizes, and the cleanest gold and emerald energy.</p>
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
            const note = root.querySelector('[data-countdown-note]');

            const tick = () => {
                const diff = target - Date.now();
                if (diff <= 0) {
                    days.textContent = '00';
                    hours.textContent = '00';
                    minutes.textContent = '00';
                    seconds.textContent = '00';
                    note.textContent = 'Happy birthday, Esthell!';
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

        const setupSponsorForm = () => {
            const openButton = root.querySelector('[data-open-sponsor]');
            const closeButton = root.querySelector('[data-close-sponsor]');
            const form = root.querySelector('[data-sponsor-form]');
            const status = root.querySelector('[data-form-status]');
            const submit = root.querySelector('[data-submit-sponsor]');
            if (!openButton || !closeButton || !form || !status || !submit) return;

            const setFormOpen = open => {
                form.classList.toggle('is-open', open);
                openButton.textContent = open ? 'Hide Sponsor Form' : 'Sponsor Esthell';
                if (open) {
                    status.textContent = '';
                    form.querySelector('input[name="platoId"]').focus();
                }
            };

            openButton.addEventListener('click', () => {
                setFormOpen(!form.classList.contains('is-open'));
            });

            closeButton.addEventListener('click', () => {
                setFormOpen(false);
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
                        color: 14200131,
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
        setupSponsorForm();
    })();
</script>
