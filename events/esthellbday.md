---
layout: tool-content
title: Esthell's Birthday - Platopedia
heading: Esthell's Birthday
---

<style>
    #esthell-birthday {
        --eb-ink: #031812;
        --eb-deep: #06291f;
        --eb-emerald: #0b6f4c;
        --eb-emerald-bright: #20b67a;
        --eb-gold: #d8ad43;
        --eb-gold-bright: #ffe39b;
        --eb-cream: #fff8df;
        --eb-soft: rgba(255, 248, 223, .82);
        --eb-line: rgba(255, 227, 155, .48);
        --eb-shadow: rgba(0, 0, 0, .34);
        position: relative;
        isolation: isolate;
        max-width: 980px;
        margin: 0 auto;
        color: var(--eb-cream);
        background:
            linear-gradient(90deg, transparent 0, rgba(255, 227, 155, .08) 1px, transparent 1px 100%),
            linear-gradient(180deg, var(--eb-ink), var(--eb-deep) 42%, #02110d);
        background-size: 22px 22px, auto;
        border: 1px solid rgba(255, 227, 155, .22);
        overflow: hidden;
    }

    #esthell-birthday,
    #esthell-birthday * {
        box-sizing: border-box;
    }

    #esthell-birthday img {
        max-width: 100%;
        height: auto;
        -webkit-user-drag: none;
        user-select: none;
    }

    #esthell-birthday :where(h1, h2, h3, p, li, span, a, button, td, th) {
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    #esthell-birthday button,
    #esthell-birthday a {
        touch-action: manipulation;
    }

    #esthell-birthday button {
        font: inherit;
    }

    #esthell-birthday::before,
    #esthell-birthday::after {
        content: "";
        position: absolute;
        z-index: -1;
        pointer-events: none;
        inset: 0;
    }

    #esthell-birthday::before {
        background:
            linear-gradient(110deg, transparent 0 18%, rgba(216, 173, 67, .12) 18% 18.3%, transparent 18.3% 100%),
            linear-gradient(250deg, transparent 0 24%, rgba(32, 182, 122, .16) 24% 24.3%, transparent 24.3% 100%);
        opacity: .75;
    }

    #esthell-birthday::after {
        background-image:
            linear-gradient(45deg, transparent 48%, rgba(255, 227, 155, .28) 49%, rgba(255, 227, 155, .28) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(32, 182, 122, .18) 49%, rgba(32, 182, 122, .18) 51%, transparent 52%);
        background-size: 86px 86px, 124px 124px;
        opacity: .35;
        animation: ebDrift 22s linear infinite;
    }

    @keyframes ebDrift {
        to {
            background-position: 86px 86px, -124px 124px;
        }
    }

    #esthell-birthday .eb-hero {
        position: relative;
        padding: 18px;
        border-bottom: 1px solid var(--eb-line);
        background:
            linear-gradient(180deg, rgba(255, 227, 155, .12), rgba(6, 41, 31, .12)),
            linear-gradient(135deg, rgba(11, 111, 76, .24), rgba(216, 173, 67, .12));
    }

    #esthell-birthday .eb-banner {
        display: block;
        position: relative;
    }

    #esthell-birthday .eb-banner img {
        display: block;
        width: 100%;
        border: 1px solid rgba(255, 227, 155, .58);
        border-radius: 8px;
        box-shadow: 0 24px 48px var(--eb-shadow);
        background: #06291f;
    }

    #esthell-birthday .eb-hero-copy {
        display: grid;
        gap: 12px;
        margin-top: 18px;
        padding: 0 4px 4px;
        text-align: center;
    }

    #esthell-birthday .eb-kicker {
        margin: 0;
        color: var(--eb-gold-bright);
        font-weight: 800;
        letter-spacing: 0;
        text-transform: uppercase;
    }

    #esthell-birthday h1,
    #esthell-birthday h2,
    #esthell-birthday h3 {
        margin: 0;
        line-height: 1.08;
        letter-spacing: 0;
    }

    #esthell-birthday h1 {
        font-size: 3.2rem;
        color: transparent;
        background: linear-gradient(90deg, var(--eb-gold-bright), var(--eb-cream), var(--eb-emerald-bright), var(--eb-gold-bright));
        background-size: 240% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        animation: ebShine 5s linear infinite;
        text-shadow: 0 0 28px rgba(255, 227, 155, .14);
    }

    #esthell-birthday h2 {
        font-size: 2rem;
        color: var(--eb-gold-bright);
    }

    #esthell-birthday h3 {
        font-size: 1.15rem;
        color: var(--eb-cream);
    }

    @keyframes ebShine {
        to {
            background-position: 240% 50%;
        }
    }

    #esthell-birthday p {
        margin: 0;
        color: var(--eb-soft);
        line-height: 1.65;
    }

    #esthell-birthday .eb-lede {
        max-width: 760px;
        margin: 0 auto;
        font-size: 1.08rem;
    }

    #esthell-birthday .eb-band {
        position: relative;
        padding: 28px 18px;
        border-bottom: 1px solid rgba(255, 227, 155, .2);
        background:
            linear-gradient(180deg, rgba(255, 255, 255, .035), rgba(0, 0, 0, .08)),
            linear-gradient(90deg, rgba(216, 173, 67, .06), rgba(32, 182, 122, .07));
    }

    #esthell-birthday .eb-section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 18px;
    }

    #esthell-birthday .eb-section-title {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
    }

    #esthell-birthday .eb-section-title img {
        width: 46px;
        height: 46px;
        object-fit: contain;
        flex: 0 0 auto;
        filter: drop-shadow(0 8px 14px rgba(0, 0, 0, .3));
    }

    #esthell-birthday .eb-facts {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 18px;
    }

    #esthell-birthday .eb-fact,
    #esthell-birthday .eb-stat,
    #esthell-birthday .eb-wish,
    #esthell-birthday .eb-podium-card {
        border: 1px solid rgba(255, 227, 155, .34);
        border-radius: 8px;
        background:
            linear-gradient(180deg, rgba(255, 248, 223, .09), rgba(255, 248, 223, .02)),
            linear-gradient(135deg, rgba(11, 111, 76, .44), rgba(3, 24, 18, .5));
        box-shadow: 0 14px 28px rgba(0, 0, 0, .2);
    }

    #esthell-birthday .eb-fact {
        min-height: 146px;
        padding: 16px 14px;
        display: grid;
        align-content: center;
        justify-items: center;
        text-align: center;
        gap: 8px;
    }

    #esthell-birthday .eb-fact img {
        width: 44px;
        height: 44px;
        object-fit: contain;
    }

    #esthell-birthday .eb-fact span,
    #esthell-birthday .eb-stat span,
    #esthell-birthday .eb-hud span,
    #esthell-birthday .eb-search span {
        color: rgba(255, 248, 223, .74);
        font-size: .82rem;
        font-weight: 700;
        letter-spacing: 0;
        text-transform: uppercase;
    }

    #esthell-birthday .eb-fact strong,
    #esthell-birthday .eb-stat strong {
        color: var(--eb-gold-bright);
        font-size: 1.24rem;
        line-height: 1.15;
    }

    #esthell-birthday .eb-countdown {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
    }

    #esthell-birthday .eb-time {
        min-height: 116px;
        display: grid;
        align-content: center;
        justify-items: center;
        gap: 6px;
        padding: 16px 10px;
        border: 1px solid rgba(255, 227, 155, .38);
        border-radius: 8px;
        background: linear-gradient(180deg, rgba(216, 173, 67, .16), rgba(11, 111, 76, .18));
    }

    #esthell-birthday .eb-time strong {
        display: block;
        color: var(--eb-cream);
        font-size: 2.35rem;
        line-height: 1;
        font-variant-numeric: tabular-nums;
    }

    #esthell-birthday .eb-time span {
        color: var(--eb-gold-bright);
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0;
        font-size: .82rem;
    }

    #esthell-birthday .eb-countdown-note {
        margin-top: 14px;
        text-align: center;
        color: var(--eb-gold-bright);
        font-weight: 800;
    }

    #esthell-birthday .eb-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin-top: 18px;
    }

    #esthell-birthday .eb-button,
    #esthell-birthday .eb-tab,
    #esthell-birthday .eb-gem {
        border: 1px solid rgba(255, 227, 155, .52);
        border-radius: 8px;
        background: linear-gradient(135deg, var(--eb-gold), #fff1b2 48%, var(--eb-emerald-bright));
        color: #031812 !important;
        font-weight: 900;
        text-decoration: none !important;
        box-shadow: 0 10px 22px rgba(0, 0, 0, .24);
        transition: transform .16s ease, box-shadow .16s ease, filter .16s ease;
        cursor: pointer;
    }

    #esthell-birthday .eb-button,
    #esthell-birthday .eb-tab {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 42px;
        padding: 10px 14px;
    }

    #esthell-birthday .eb-button:hover,
    #esthell-birthday .eb-tab:hover,
    #esthell-birthday .eb-gem:hover,
    #esthell-birthday .eb-wish:hover {
        transform: translateY(-2px);
        filter: saturate(1.08);
    }

    #esthell-birthday .eb-button:active,
    #esthell-birthday .eb-tab:active,
    #esthell-birthday .eb-gem:active,
    #esthell-birthday .eb-wish:active {
        transform: translateY(0);
    }

    #esthell-birthday :focus-visible {
        outline: 3px solid var(--eb-gold-bright);
        outline-offset: 3px;
    }

    #esthell-birthday .eb-scroll-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        align-items: stretch;
    }

    #esthell-birthday .eb-scroll-panel {
        position: relative;
        min-height: 100%;
        padding: 18px;
        border: 1px solid rgba(255, 227, 155, .3);
        background: rgba(3, 24, 18, .52);
    }

    #esthell-birthday .eb-scroll-panel::before {
        content: "";
        position: absolute;
        inset: 7px;
        border: 1px solid rgba(255, 227, 155, .18);
        pointer-events: none;
    }

    #esthell-birthday .eb-scroll-panel h3,
    #esthell-birthday .eb-scroll-panel p,
    #esthell-birthday .eb-scroll-panel ol {
        position: relative;
    }

    #esthell-birthday .eb-scroll-panel h3 {
        margin-bottom: 10px;
        color: var(--eb-gold-bright);
    }

    #esthell-birthday .eb-scroll-panel ol {
        margin: 0;
        padding-left: 20px;
        color: var(--eb-soft);
        line-height: 1.65;
    }

    #esthell-birthday .eb-banner-card {
        display: grid;
        align-content: center;
        gap: 14px;
        padding: 18px;
        border: 1px solid rgba(255, 227, 155, .3);
        background: rgba(3, 24, 18, .52);
        text-align: center;
    }

    #esthell-birthday .eb-banner-card img {
        width: min(420px, 100%);
        margin: 0 auto;
        border-radius: 8px;
        border: 1px solid rgba(255, 227, 155, .42);
    }

    #esthell-birthday .eb-stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 18px;
    }

    #esthell-birthday .eb-stat {
        min-height: 104px;
        padding: 16px;
        display: grid;
        align-content: center;
        gap: 7px;
    }

    #esthell-birthday .eb-stat strong {
        font-size: 1.5rem;
        font-variant-numeric: tabular-nums;
    }

    #esthell-birthday .eb-toolbar {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 12px;
        align-items: end;
        margin-bottom: 14px;
    }

    #esthell-birthday .eb-search {
        display: grid;
        gap: 6px;
    }

    #esthell-birthday .eb-search input {
        width: 100%;
        min-height: 42px;
        border: 1px solid rgba(255, 227, 155, .44);
        border-radius: 8px;
        background: rgba(0, 0, 0, .28);
        color: var(--eb-cream);
        padding: 10px 12px;
        font: inherit;
    }

    #esthell-birthday .eb-search input::placeholder {
        color: rgba(255, 248, 223, .52);
    }

    #esthell-birthday .eb-tabs {
        display: inline-flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    #esthell-birthday .eb-tab {
        background: linear-gradient(180deg, rgba(255, 248, 223, .12), rgba(11, 111, 76, .48));
        color: var(--eb-cream) !important;
        min-width: 88px;
    }

    #esthell-birthday .eb-tab.is-active {
        color: #031812 !important;
        background: linear-gradient(135deg, var(--eb-gold-bright), var(--eb-gold));
    }

    #esthell-birthday .eb-podium {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
        margin: 14px 0;
    }

    #esthell-birthday .eb-podium-card {
        min-height: 116px;
        display: grid;
        align-content: center;
        justify-items: center;
        gap: 8px;
        padding: 14px 10px;
        text-align: center;
    }

    #esthell-birthday .eb-podium-rank {
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        color: #031812;
        background: linear-gradient(135deg, var(--eb-gold-bright), var(--eb-gold));
        font-weight: 900;
        box-shadow: 0 0 0 4px rgba(216, 173, 67, .16);
    }

    #esthell-birthday .eb-podium-card strong {
        color: var(--eb-cream);
    }

    #esthell-birthday .eb-podium-card span {
        color: var(--eb-gold-bright);
        font-weight: 800;
        font-variant-numeric: tabular-nums;
    }

    #esthell-birthday .eb-table-wrap {
        overflow-x: auto;
        border: 1px solid rgba(255, 227, 155, .26);
        border-radius: 8px;
    }

    #esthell-birthday table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        min-width: 520px;
        background: rgba(3, 24, 18, .42);
    }

    #esthell-birthday th,
    #esthell-birthday td {
        padding: 12px 14px;
        border-bottom: 1px solid rgba(255, 227, 155, .18);
        color: var(--eb-soft);
        text-align: left;
    }

    #esthell-birthday th {
        position: sticky;
        top: 0;
        z-index: 1;
        color: #031812;
        background: linear-gradient(135deg, var(--eb-gold-bright), var(--eb-gold));
    }

    #esthell-birthday td:last-child,
    #esthell-birthday th:last-child {
        text-align: right;
        font-variant-numeric: tabular-nums;
    }

    #esthell-birthday tbody tr:nth-child(even) {
        background: rgba(255, 248, 223, .035);
    }

    #esthell-birthday tbody tr.is-hidden {
        display: none;
    }

    #esthell-birthday .eb-wishes {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px;
    }

    #esthell-birthday .eb-wish {
        min-height: 160px;
        width: 100%;
        padding: 16px;
        color: var(--eb-cream);
        text-align: left;
        cursor: pointer;
        transition: transform .16s ease, border-color .16s ease, background .16s ease;
    }

    #esthell-birthday .eb-wish strong {
        display: block;
        margin-bottom: 10px;
        color: var(--eb-gold-bright);
        font-size: 1.12rem;
    }

    #esthell-birthday .eb-wish span {
        display: block;
        color: var(--eb-soft);
        line-height: 1.5;
    }

    #esthell-birthday .eb-wish .eb-wish-open {
        display: none;
    }

    #esthell-birthday .eb-wish.is-open {
        border-color: rgba(32, 182, 122, .72);
        background:
            linear-gradient(180deg, rgba(32, 182, 122, .22), rgba(255, 227, 155, .07)),
            linear-gradient(135deg, rgba(11, 111, 76, .62), rgba(3, 24, 18, .62));
    }

    #esthell-birthday .eb-wish.is-open .eb-wish-closed {
        display: none;
    }

    #esthell-birthday .eb-wish.is-open .eb-wish-open {
        display: block;
    }

    #esthell-birthday .eb-game-shell {
        display: grid;
        gap: 14px;
    }

    #esthell-birthday .eb-hud {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
        gap: 10px;
        align-items: stretch;
    }

    #esthell-birthday .eb-hud-item {
        min-height: 58px;
        display: grid;
        align-content: center;
        gap: 2px;
        padding: 10px 12px;
        border: 1px solid rgba(255, 227, 155, .26);
        border-radius: 8px;
        background: rgba(0, 0, 0, .18);
    }

    #esthell-birthday .eb-hud strong {
        color: var(--eb-gold-bright);
        font-size: 1.2rem;
        font-variant-numeric: tabular-nums;
    }

    #esthell-birthday .eb-board {
        position: relative;
        min-height: 320px;
        aspect-ratio: 16 / 9;
        border: 1px solid rgba(255, 227, 155, .34);
        border-radius: 8px;
        overflow: hidden;
        background:
            linear-gradient(90deg, rgba(255, 227, 155, .06) 1px, transparent 1px),
            linear-gradient(180deg, rgba(255, 227, 155, .06) 1px, transparent 1px),
            linear-gradient(135deg, rgba(11, 111, 76, .38), rgba(0, 0, 0, .26));
        background-size: 34px 34px, 34px 34px, auto;
    }

    #esthell-birthday .eb-game-message {
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 20px;
        color: var(--eb-soft);
        text-align: center;
        font-weight: 800;
    }

    #esthell-birthday .eb-gem {
        position: absolute;
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        padding: 0;
        border-radius: 8px;
        transform: rotate(45deg);
        animation: ebGemIn .22s ease both;
    }

    #esthell-birthday .eb-gem::before {
        content: "";
        width: 18px;
        height: 18px;
        border: 2px solid rgba(3, 24, 18, .74);
        background: var(--eb-emerald-bright);
    }

    @keyframes ebGemIn {
        from {
            opacity: 0;
            transform: scale(.7) rotate(45deg);
        }
        to {
            opacity: 1;
            transform: scale(1) rotate(45deg);
        }
    }

    #esthell-birthday .eb-final {
        padding: 32px 18px 36px;
        text-align: center;
        background:
            linear-gradient(180deg, rgba(216, 173, 67, .12), rgba(11, 111, 76, .22)),
            rgba(0, 0, 0, .1);
    }

    #esthell-birthday .eb-final p {
        max-width: 680px;
        margin: 12px auto 0;
    }

    #esthell-birthday .eb-confetti {
        position: absolute;
        z-index: 5;
        width: 8px;
        height: 14px;
        border-radius: 2px;
        pointer-events: none;
        animation: ebConfetti 1.2s ease-out forwards;
    }

    @keyframes ebConfetti {
        from {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 1;
        }
        to {
            transform: translate3d(var(--x), var(--y), 0) rotate(220deg);
            opacity: 0;
        }
    }

    @media (max-width: 820px) {
        #esthell-birthday h1 {
            font-size: 2.45rem;
        }

        #esthell-birthday .eb-facts,
        #esthell-birthday .eb-countdown {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        #esthell-birthday .eb-scroll-layout,
        #esthell-birthday .eb-toolbar {
            grid-template-columns: 1fr;
        }

        #esthell-birthday .eb-tabs {
            justify-content: stretch;
        }

        #esthell-birthday .eb-tab {
            flex: 1 1 120px;
        }

        #esthell-birthday .eb-stats,
        #esthell-birthday .eb-podium,
        #esthell-birthday .eb-wishes {
            grid-template-columns: 1fr;
        }

        #esthell-birthday .eb-hud {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        #esthell-birthday .eb-hud .eb-button {
            grid-column: 1 / -1;
        }
    }

    @media (max-width: 520px) {
        #esthell-birthday {
            border-left: 0;
            border-right: 0;
        }

        #esthell-birthday .eb-hero,
        #esthell-birthday .eb-band,
        #esthell-birthday .eb-final {
            padding-left: 12px;
            padding-right: 12px;
        }

        #esthell-birthday h1 {
            font-size: 2rem;
        }

        #esthell-birthday h2 {
            font-size: 1.55rem;
        }

        #esthell-birthday .eb-lede {
            font-size: 1rem;
        }

        #esthell-birthday .eb-facts,
        #esthell-birthday .eb-countdown,
        #esthell-birthday .eb-hud {
            grid-template-columns: 1fr;
        }

        #esthell-birthday .eb-board {
            min-height: 280px;
            aspect-ratio: 4 / 5;
        }

        #esthell-birthday table {
            min-width: 460px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        #esthell-birthday,
        #esthell-birthday *,
        #esthell-birthday::after {
            animation: none !important;
            transition-duration: .01ms !important;
            scroll-behavior: auto !important;
        }
    }
</style>

<div id="esthell-birthday" data-event-date="2026-05-13T13:00:00Z">
    <section class="eb-hero" aria-labelledby="esthell-title">
        <picture class="eb-banner">
            <img src="/docs/assets/images/events/esthellbday/esthellbday-banner.png" alt="Esthell Birthday banner, May 13 at 1 PM GMT" width="2000" height="800" fetchpriority="high" decoding="async">
        </picture>

        <div class="eb-hero-copy">
            <p class="eb-kicker">By Royal Decree</p>
            <h1 id="esthell-title">Esthell's Birthday</h1>
            <p class="eb-lede">We're getting close to a full Arcade celebration for one of our sharpest, sweetest, get-it-done friends. The birthday group opens on <strong>May 13 at exactly 1 PM GMT</strong>, with games, prizes, and enough gold-energy chaos to make the whole room sparkle.</p>
        </div>

        <div class="eb-facts" aria-label="Event details">
            <article class="eb-fact">
                <img src="/docs/assets/images/events/esthellbday/calendar.png" alt="">
                <span>Date</span>
                <strong>May 13</strong>
            </article>
            <article class="eb-fact">
                <img src="/docs/assets/images/events/esthellbday/clock.png" alt="">
                <span>Time</span>
                <strong>1 PM GMT</strong>
            </article>
            <article class="eb-fact">
                <img src="/docs/assets/images/events/esthellbday/prize.png" alt="">
                <span>Prize Pool</span>
                <strong><span data-total-coins>0</span> coins</strong>
            </article>
            <article class="eb-fact">
                <img src="/docs/assets/images/events/esthellbday/sphinx.png" alt="">
                <span>Guest of Honor</span>
                <strong>esthell</strong>
            </article>
        </div>
    </section>

    <section class="eb-band" aria-labelledby="countdown-title">
        <div class="eb-section-head">
            <div class="eb-section-title">
                <img src="/docs/assets/images/events/esthellbday/clock.png" alt="">
                <h2 id="countdown-title">Royal Countdown</h2>
            </div>
        </div>

        <div class="eb-countdown" aria-live="polite">
            <div class="eb-time"><strong data-days>00</strong><span>Days</span></div>
            <div class="eb-time"><strong data-hours>00</strong><span>Hours</span></div>
            <div class="eb-time"><strong data-minutes>00</strong><span>Minutes</span></div>
            <div class="eb-time"><strong data-seconds>00</strong><span>Seconds</span></div>
        </div>
        <p class="eb-countdown-note" data-countdown-note>May 13, 2026 - 1 PM GMT</p>
        <div class="eb-actions">
            <button class="eb-button" type="button" data-confetti>Celebrate Esthell</button>
            <a class="eb-button" href="#sponsor-board">Sponsor Board</a>
        </div>
    </section>

    <section class="eb-band" aria-labelledby="party-scroll-title">
        <div class="eb-section-head">
            <div class="eb-section-title">
                <img src="/docs/assets/images/events/esthellbday/scroll-edited.png" alt="">
                <h2 id="party-scroll-title">Party Scroll</h2>
            </div>
        </div>

        <div class="eb-scroll-layout">
            <div class="eb-scroll-panel">
                <h3>Birthday Decree</h3>
                <p>Esthell's day deserves the royal treatment: arrive early, bring a loud birthday wish, and stay ready for prizes. This one is built for the people who show up on time and keep the room alive.</p>
            </div>
            <div class="eb-scroll-panel">
                <h3>Invite Notes</h3>
                <ol>
                    <li>The event starts on May 13 at exactly 1 PM GMT.</li>
                    <li>The birthday group invite will be shared before the celebration.</li>
                    <li>Prize rounds and mini-games begin once the group is settled.</li>
                </ol>
            </div>
        </div>
    </section>

    <section class="eb-band" aria-labelledby="birthday-frame-title">
        <div class="eb-section-head">
            <div class="eb-section-title">
                <img src="/docs/assets/images/events/esthellbday/feather-pen.png" alt="">
                <h2 id="birthday-frame-title">Birthday Banner</h2>
            </div>
        </div>

        <div class="eb-banner-card">
            <img src="/docs/assets/images/events/esthellbday/esthellbday-banner.png" alt="Esthell Birthday banner preview" width="2000" height="800" loading="lazy" decoding="async">
            <p>The official gold and emerald banner is ready for posts, announcements, and the birthday group.</p>
            <div class="eb-actions">
                <a class="eb-button" href="/docs/assets/images/events/esthellbday/esthellbday-banner.png" download>Download Banner</a>
            </div>
        </div>
    </section>

    <section class="eb-band" id="sponsor-board" aria-labelledby="sponsor-title">
        <div class="eb-section-head">
            <div class="eb-section-title">
                <img src="/docs/assets/images/events/esthellbday/prize.png" alt="">
                <h2 id="sponsor-title">Sponsor Board</h2>
            </div>
        </div>

        <div class="eb-stats" aria-label="Sponsor summary">
            <div class="eb-stat"><span>Total Sponsored</span><strong><span data-total-coins>0</span></strong></div>
            <div class="eb-stat"><span>Top Sponsor</span><strong data-top-sponsor>Loading</strong></div>
            <div class="eb-stat"><span>Sponsors</span><strong data-sponsor-count>0</strong></div>
        </div>

        <div class="eb-toolbar">
            <label class="eb-search">
                <span>Sponsor Search</span>
                <input type="search" data-sponsor-search placeholder="Type a sponsor name">
            </label>
            <div class="eb-tabs" role="group" aria-label="Sponsor sorting">
                <button class="eb-tab is-active" type="button" data-sort-sponsors="amount">Amount</button>
                <button class="eb-tab" type="button" data-sort-sponsors="name">Name</button>
            </div>
        </div>

        <div class="eb-podium" data-podium aria-label="Top sponsors"></div>

        <div class="eb-table-wrap">
            <table id="esthell-sponsors">
                <thead>
                    <tr>
                        <th scope="col">Sponsor</th>
                        <th scope="col">Amount (Coins)</th>
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
        </div>
    </section>

    <section class="eb-band" aria-labelledby="wish-title">
        <div class="eb-section-head">
            <div class="eb-section-title">
                <img src="/docs/assets/images/events/esthellbday/pyramids.png" alt="">
                <h2 id="wish-title">Wish Vault</h2>
            </div>
        </div>

        <div class="eb-wishes">
            <button class="eb-wish" type="button" aria-expanded="false">
                <strong>Wish 01</strong>
                <span class="eb-wish-closed">Gold seal locked.</span>
                <span class="eb-wish-open">May every room you enter become easier, brighter, and more hilarious because you are in it.</span>
            </button>
            <button class="eb-wish" type="button" aria-expanded="false">
                <strong>Wish 02</strong>
                <span class="eb-wish-closed">Emerald seal locked.</span>
                <span class="eb-wish-open">May your birthday bring the exact mix of peace, attention, prizes, and chaos you secretly prefer.</span>
            </button>
            <button class="eb-wish" type="button" aria-expanded="false">
                <strong>Wish 03</strong>
                <span class="eb-wish-closed">Royal seal locked.</span>
                <span class="eb-wish-open">May your year be full of wins that arrive cleanly, loudly, and with witnesses.</span>
            </button>
            <button class="eb-wish" type="button" aria-expanded="false">
                <strong>Wish 04</strong>
                <span class="eb-wish-closed">Arcade seal locked.</span>
                <span class="eb-wish-open">May the people around you match your effort, your standards, and your timing.</span>
            </button>
            <button class="eb-wish" type="button" aria-expanded="false">
                <strong>Wish 05</strong>
                <span class="eb-wish-closed">Prize seal locked.</span>
                <span class="eb-wish-open">May your lucky streak arrive early and refuse to leave.</span>
            </button>
            <button class="eb-wish" type="button" aria-expanded="false">
                <strong>Wish 06</strong>
                <span class="eb-wish-closed">Final seal locked.</span>
                <span class="eb-wish-open">Happy birthday, Esthell. You are loved, appreciated, and absolutely worth celebrating properly.</span>
            </button>
        </div>
    </section>

    <section class="eb-band" aria-labelledby="game-title">
        <div class="eb-section-head">
            <div class="eb-section-title">
                <img src="/docs/assets/images/events/esthellbday/sphinx.png" alt="">
                <h2 id="game-title">Emerald Rush</h2>
            </div>
        </div>

        <div class="eb-game-shell">
            <div class="eb-hud">
                <div class="eb-hud-item"><span>Score</span><strong data-game-score>0</strong></div>
                <div class="eb-hud-item"><span>Time</span><strong data-game-time>20</strong></div>
                <div class="eb-hud-item"><span>Best</span><strong data-game-best>0</strong></div>
                <button class="eb-button" type="button" data-game-start>Start</button>
            </div>
            <div class="eb-board" data-game-board>
                <div class="eb-game-message" data-game-message>Press Start when ready.</div>
            </div>
        </div>
    </section>

    <section class="eb-final" aria-labelledby="final-title">
        <h2 id="final-title">Happy Birthday, Esthell</h2>
        <p>May 13 belongs to you. Arcade is showing up with gold, emeralds, prizes, and a whole lot of love.</p>
    </section>
</div>

<script>
    (() => {
        const root = document.getElementById('esthell-birthday');
        if (!root) return;

        const numberFrom = value => parseInt(String(value || '').replace(/[^\d]/g, ''), 10) || 0;
        const format = value => value.toLocaleString('en-US');
        const pad = value => String(value).padStart(2, '0');

        const burstConfetti = (x, y, amount = 34) => {
            const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reduceMotion) return;

            const box = root.getBoundingClientRect();
            const startX = x == null ? box.width / 2 : x - box.left;
            const startY = y == null ? 140 : y - box.top;
            const colors = ['#ffe39b', '#d8ad43', '#20b67a', '#fff8df'];

            for (let i = 0; i < amount; i += 1) {
                const piece = document.createElement('span');
                piece.className = 'eb-confetti';
                piece.style.left = `${startX}px`;
                piece.style.top = `${startY}px`;
                piece.style.background = colors[i % colors.length];
                piece.style.setProperty('--x', `${Math.round((Math.random() - .5) * 360)}px`);
                piece.style.setProperty('--y', `${Math.round(130 + Math.random() * 260)}px`);
                piece.style.animationDelay = `${Math.random() * .14}s`;
                root.appendChild(piece);
                piece.addEventListener('animationend', () => piece.remove(), { once: true });
                setTimeout(() => piece.remove(), 1600);
            }
        };

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
            const search = root.querySelector('[data-sponsor-search]');
            const tabs = Array.from(root.querySelectorAll('[data-sort-sponsors]'));
            const podium = root.querySelector('[data-podium]');
            if (!tbody) return;

            const rows = Array.from(tbody.rows).map((row, index) => ({
                index,
                row,
                name: row.cells[0].textContent.trim(),
                amount: numberFrom(row.cells[1].textContent)
            }));

            const renderSummary = () => {
                const total = rows.reduce((sum, item) => sum + item.amount, 0);
                root.querySelectorAll('[data-total-coins]').forEach(el => {
                    el.textContent = format(total);
                });

                const top = rows.slice().sort((a, b) => b.amount - a.amount || a.index - b.index)[0];
                const topEl = root.querySelector('[data-top-sponsor]');
                const countEl = root.querySelector('[data-sponsor-count]');
                if (topEl) topEl.textContent = top ? `${top.name} (${format(top.amount)})` : 'None';
                if (countEl) countEl.textContent = String(rows.length);

                if (podium) {
                    podium.innerHTML = rows.slice()
                        .sort((a, b) => b.amount - a.amount || a.index - b.index)
                        .slice(0, 3)
                        .map((item, i) => `
                            <article class="eb-podium-card">
                                <span class="eb-podium-rank">${i + 1}</span>
                                <strong>${item.name}</strong>
                                <span>${format(item.amount)} coins</span>
                            </article>
                        `).join('');
                }
            };

            const applyFilter = () => {
                const query = (search && search.value || '').trim().toLowerCase();
                rows.forEach(item => {
                    item.row.classList.toggle('is-hidden', query && !item.name.toLowerCase().includes(query));
                });
            };

            const applySort = mode => {
                const sorted = rows.slice().sort((a, b) => {
                    if (mode === 'name') return a.name.localeCompare(b.name) || b.amount - a.amount;
                    return b.amount - a.amount || a.name.localeCompare(b.name);
                });
                sorted.forEach(item => tbody.appendChild(item.row));
                tabs.forEach(tab => tab.classList.toggle('is-active', tab.dataset.sortSponsors === mode));
                applyFilter();
            };

            tabs.forEach(tab => {
                tab.addEventListener('click', () => applySort(tab.dataset.sortSponsors));
            });

            if (search) search.addEventListener('input', applyFilter);
            renderSummary();
            applySort('amount');
        };

        const setupWishes = () => {
            root.querySelectorAll('.eb-wish').forEach(wish => {
                wish.addEventListener('click', event => {
                    const open = !wish.classList.contains('is-open');
                    wish.classList.toggle('is-open', open);
                    wish.setAttribute('aria-expanded', open ? 'true' : 'false');
                    if (open) burstConfetti(event.clientX, event.clientY, 12);
                });
            });
        };

        const setupGame = () => {
            const board = root.querySelector('[data-game-board]');
            const start = root.querySelector('[data-game-start]');
            const scoreEl = root.querySelector('[data-game-score]');
            const timeEl = root.querySelector('[data-game-time]');
            const bestEl = root.querySelector('[data-game-best]');
            const message = root.querySelector('[data-game-message]');
            if (!board || !start || !scoreEl || !timeEl || !bestEl || !message) return;

            let score = 0;
            let best = 0;
            let time = 20;
            let spawnTimer = 0;
            let clockTimer = 0;
            let active = false;

            const clearGems = () => {
                board.querySelectorAll('.eb-gem').forEach(gem => gem.remove());
            };

            const spawnGem = () => {
                if (!active) return;
                const gem = document.createElement('button');
                const boardBox = board.getBoundingClientRect();
                const size = 42;
                const maxX = Math.max(0, boardBox.width - size - 8);
                const maxY = Math.max(0, boardBox.height - size - 8);
                gem.className = 'eb-gem';
                gem.type = 'button';
                gem.setAttribute('aria-label', 'Collect emerald');
                gem.style.left = `${8 + Math.random() * maxX}px`;
                gem.style.top = `${8 + Math.random() * maxY}px`;

                gem.addEventListener('click', event => {
                    if (!active) return;
                    score += 1;
                    scoreEl.textContent = String(score);
                    burstConfetti(event.clientX, event.clientY, 8);
                    gem.remove();
                }, { once: true });

                board.appendChild(gem);
                setTimeout(() => gem.remove(), 1300);
            };

            const finish = () => {
                active = false;
                clearInterval(spawnTimer);
                clearInterval(clockTimer);
                clearGems();
                best = Math.max(best, score);
                bestEl.textContent = String(best);
                message.hidden = false;
                message.textContent = score >= 18
                    ? `Royal run: ${score} emeralds. Esthell would approve.`
                    : `Collected ${score} emeralds. Run it back for the crown.`;
                burstConfetti(null, null, score >= 18 ? 46 : 22);
                start.disabled = false;
                start.textContent = 'Restart';
            };

            const begin = () => {
                active = true;
                score = 0;
                time = 20;
                scoreEl.textContent = '0';
                timeEl.textContent = '20';
                message.hidden = true;
                clearGems();
                start.disabled = true;

                spawnGem();
                spawnTimer = setInterval(spawnGem, 540);
                clockTimer = setInterval(() => {
                    time -= 1;
                    timeEl.textContent = String(time);
                    if (time <= 0) finish();
                }, 1000);
            };

            start.addEventListener('click', begin);
        };

        root.querySelector('[data-confetti]')?.addEventListener('click', event => {
            burstConfetti(event.clientX, event.clientY, 54);
        });

        root.addEventListener('contextmenu', event => {
            if (event.target.closest('img')) event.preventDefault();
        });

        setupCountdown();
        setupSponsors();
        setupWishes();
        setupGame();
    })();
</script>
