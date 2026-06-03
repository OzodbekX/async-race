# Async Race 🏁

**Score: 400/400 pts** _(self-checked functional + tooling; the 100 discretionary code-quality points are reviewer-assessed and excluded per the checklist note)_

**Deployment:** _<!-- TODO: paste your deployed UI link here, e.g. https://async-race-xxxx.vercel.app -->_

A single-page app to manage a collection of radio-controlled cars, run drag races, and track winners. Built with React + Redux Toolkit + TypeScript.

---

## Tech stack

- **React 19** + **React Router 7** (two views, client-side routing)
- **Redux Toolkit** + **RTK Query** (state management + server cache)
- **TypeScript** (strict mode, `noImplicitAny`)
- **Tailwind CSS v4** (styling)
- **Vite 8** (dev/build)
- **ESLint** (Airbnb style guide via `eslint-config-airbnb-extended`) + **Prettier**

## Getting started

This app needs the **mock backend running locally** — it is not bundled here.

```bash
# 1. Start the backend (in a separate folder/terminal)
git clone https://github.com/mikhama/async-race-api.git
cd async-race-api
npm install
npm start            # serves http://127.0.0.1:3000

# 2. Start this frontend
npm install
npm run dev          # serves http://localhost:3009
```

The API base URL is configured in [`src/constants.ts`](src/constants.ts).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server (port 3009) |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint (Airbnb config) |
| `npm run format` | Auto-format with Prettier |
| `npm run ci:format` | Check formatting without writing |

## Deployment

The build is a static SPA. `public/_redirects` (Netlify) and `vercel.json` (Vercel) are included so client-side routes resolve to `index.html`. Run `npm run build` and deploy the `dist/` folder, then paste the live URL at the top of this file.
_(For GitHub Pages, set `base: '/<repo-name>/'` in `vite.config.ts` and add a 404 fallback.)_

## Architecture

Clear separation of concerns:

- **API layer** — [`src/api/racingApi.ts`](src/api/racingApi.ts): all server communication (RTK Query + a `fetch` helper).
- **State** — [`src/features/ui/uiSlice.ts`](src/features/ui/uiSlice.ts) (persistent UI: pages, sort, form inputs), [`src/features/race/raceSlice.ts`](src/features/race/raceSlice.ts) (per-car race state).
- **Race engine** — [`src/features/race/useRaceControls.ts`](src/features/race/useRaceControls.ts): custom hook running the `requestAnimationFrame` loop, engine calls, winner detection.
- **UI** — `src/components`, `src/features/garage`, `src/pages`.

**Race-on-switch behaviour:** _freeze & resume_. The animation loop lives in a `useEffect`, so leaving the Garage cancels the pending frame (cars freeze in place); returning resumes each car from its stored progress.

---

## Checklist — 400/400 pts

### 🚀 UI Deployment

- [ ] **Deployment Platform** — _build is deploy-ready (`dist/` + SPA rewrites); paste the link above after deploying._

### ✅ Requirements to Commits and Repository

- [x] **Commit guidelines compliance** — Conventional Commits.
- [x] **Checklist included in README.md**
- [x] **Score calculation** — at the top of this file.
- [ ] **UI Deployment link in README.md** — _add after deploying._

### Basic Structure (80 points)

- [x] **Two Views (10)** — Garage and Winners.
- [x] **Garage View Content (30)** — view name, create/edit panel, race control panel, garage section.
- [x] **Winners View Content (10)** — view name, winners table, pagination.
- [x] **Persistent State (30)** — pages, sort, and form inputs are held in Redux and survive view switches.

### Garage View (90 points)

- [x] **CRUD Operations (20)** — create / update / delete; empty & too-long names handled; delete also removes the car from winners.
- [x] **Color Selection (10)** — RGB color picker, reflected on the car icon and name.
- [x] **Random Car Creation (20)** — 100 random cars/click; names from 10×10 brand/model parts; random colors.
- [x] **Car Management Buttons (10)** — Select / Remove next to each car.
- [x] **Pagination (10)** — 7 cars per page.
- [x] **EXTRA (20)** — "No cars" empty state; removing the last car on a page moves you to the previous page.

### 🏆 Winners View (50 points)

- [x] **Display Winners (15)** — winners appear after a race.
- [x] **Pagination (10)** — 10 winners per page.
- [x] **Winners Table (15)** — №, car icon, name, wins, best time; wins increment and best time keeps the minimum.
- [x] **Sorting (10)** — by wins and time, ascending/descending (server-side via query params).

### 🚗 Race (170 points)

- [x] **Start Engine Animation (20)** — start → await velocity → animate → drive request; stops on 500.
- [x] **Stop Engine Animation (20)** — stop → await → car returns to start.
- [x] **Responsive Animation (30)** — percentage-based track, works down to 500px.
- [x] **Start Race Button (10)** — races all cars on the current page.
- [x] **Reset Race Button (15)** — returns all cars to start.
- [x] **Winner Announcement (5)** — banner with the winning car's name and time.
- [x] **Button States (20)** — start disabled while driving; stop disabled at the start line.
- [x] **Actions during the race (50)** — select/remove/create/update and pagination are locked during a race; switching views freezes & resumes predictably.

### 🎨 Prettier and ESLint (10 points)

- [x] **Prettier Setup (5)** — `format` and `ci:format` scripts.
- [x] **ESLint Configuration (5)** — Airbnb style guide (`eslint-config-airbnb-extended`), strict TS settings, `lint` script.

### 🌟 Overall Code Quality (100 points) — _reviewer-assessed, not self-scored_

- Modular design (API / state / UI layers), small focused functions (<40 lines), no magic numbers (centralized in `src/constants.ts`), custom hooks, and React Router.
