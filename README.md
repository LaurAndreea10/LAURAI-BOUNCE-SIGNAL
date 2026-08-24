# LAURAI / BOUNCE SIGNAL

**Chapter 03 — Mission Control** in the LaurAI Signal Network.

An interactive email-delivery recovery experience that turns bounce handling into a sci-fi mission-control simulation. Select a failure scenario, scan the signal, repair the route, retry delivery and build an operator history while LaurAI guides the transmission back toward the inbox.

## Live demo

**GitHub Pages:** https://laurandreea10.github.io/LAURAI-BOUNCE-SIGNAL/

## What it includes

- 8 email-delivery scenarios, including Soft Bounce, Hard Bounce, Mailbox Full, Spam Block, Domain Offline, Delayed Delivery, Signal Storm and Perfect Delivery
- interactive Mission Control workflow with signal scan, retry, pulse and pause actions
- fallback-channel selection and difficulty controls
- AI-analysis and recommended-action panel
- telemetry for bounce count, latency, retries, health, trust and risk
- SPF, DKIM, DMARC and MX status indicators
- transmission console and mission history
- JSON/TXT export and copyable reports
- XP, levels, streaks and unlockable achievements
- command palette and keyboard shortcuts
- English / Romanian interface support
- multiple visual themes
- reduced-motion and high-contrast options
- local persistence with `localStorage`
- responsive layout and keyboard-focus states

## Project journey

The interface presents **Bounce Signal** as Chapter 03 of a larger LaurAI email/signal universe:

1. Email Alerts — Detection
2. Signal Orbit — Network
3. **Bounce Signal — Recovery**
4. Dead Letter Orbit — Quarantine
5. Quantum Delivery — Multichannel

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- Web Storage API (`localStorage`)
- GitHub Pages

No framework or build step is required.

## Run locally

Clone the repository and open `index.html` in a browser, or serve the folder with any static local server.

```bash
git clone https://github.com/LaurAndreea10/LAURAI-BOUNCE-SIGNAL.git
cd LAURAI-BOUNCE-SIGNAL
```

## File structure

```text
LAURAI-BOUNCE-SIGNAL/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Accessibility

The project includes a skip link, visible keyboard focus, semantic controls, live status/toast regions, reduced-motion support and a high-contrast option. Accessibility is treated as part of the interaction design rather than an optional add-on.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `R` | Retry |
| `S` | Scan |
| `P` | Pulse |
| `Space` | Pause |
| `1–8` | Select scenario |
| `Ctrl/Cmd + K` | Open command palette |

## Version

Current interface version: **v3.0.0**.

## Author

Created by **Laura Andreea / LaurAI** as part of an ongoing front-end experimentation series focused on interactive interfaces, email concepts, accessibility and playful product experiences.

---

If you like the project, you can star the repository and explore the rest of the LaurAI experiments in the portfolio.