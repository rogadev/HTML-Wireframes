# Tech Central – Development TODO

This living document captures the outstanding work needed to satisfy the **kept** front-end user stories (see `docs/User Stories - CSD Website - Front End.csv`) while bringing our new SvelteKit app (`/app`) up to parity.

Each task explains **WHAT** must be delivered, **WHY** it matters, and any **key notes / dependencies** that future contributors should know. Where helpful we reference the matching story IDs.

---

## 1 · Framework & Code-Quality Upgrades

### 1.1 Eliminate deprecated Svelte 5 APIs

- **What**: Replace every use of `createEventDispatcher` with explicit callback props (see custom instructions). Start with `src/lib/components/Button.svelte` and add lint rule to prevent regressions.
- **Why**: `createEventDispatcher` is deprecated; removing it prevents future breaking changes and improves type-safety.
- **Stories**: Internal technical debt.
- **Acceptance**:
  - No import of `createEventDispatcher` remains in the repo.
  - Events are emitted through typed props (e.g. `onClick`).

### 1.2 Migrate from `$app/stores` → `$app/state`

- **What**: Update all imports of `page` from `$app/stores` to `$app/state` (currently found in `SearchBar.svelte`; run global grep after refactor).
- **Why**: Keeps us on supported SvelteKit APIs and removes deprecation warnings.
- **Acceptance**: CI/linter reports zero `$app/stores` references.

---

## 2 · Content Metadata & Visual Indicators

### 2.1 Last-Updated Stamp on every document (F22, F85, F99)

- **What**: Expose `lastUpdated` field in article JSON and render a prominent "Last updated: YYYY-MM-DD" element at top of each content page.
- **Why**: Gives technicians confidence they are using current info; required by multiple stories.
- **Key Notes**:
  - Update article schema in `/lib/types/article.ts`.
  - Add unit-test that fails if stamp is omitted.

### 2.2 Automatic watermark/header on downloads (F21)

- **What**: When a PDF/Doc is generated or downloaded, inject a header with "Last updated: <date> • Downloaded: <current date>".
- **Implementation sketch**: Use `pdf-lib` in an API route (`/api/download`) to add overlay before streaming file.
- **Why**: Ensures offline copies remain traceable.

### 2.3 "NEW" & "UPDATED" flags (F23, F39)

- **What**: In section listing components and card grids, show visual chips:
  - NEW – displayed for 30 days after `publishedDate`.
  - UPDATED – for 14 days after `lastUpdated`.
- **Why**: Allows quick scanning for recent changes.
- **Dependencies**: Relies on accurate `publishedDate/lastUpdated` fields.

---

## 3 · Feedback & Issue Reporting

### 3.1 Inline Feedback Widget (F53, F91, F81)

- **What**: Provide "Is this page helpful?" thumbs-up/down + "Report issue" button at bottom of every article.
- **Why**: Enables rapid crowdsourcing of corrections.
- **Acceptance**:
  - Submitting opens modal with form (pre-filled page URL) and posts to `/api/feedback`.
  - Author/email notifications stubbed for now.

### 3.2 Flag as Out-of-Date toggle (F91)

- **What**: Authenticated content owners can flip an "Out-of-date" switch that surfaces a yellow banner on the article until resolved.

---

## 4 · Homepage Enhancements

### 4.1 Critical & System Outage Banner (F15, F58)

- **What**: Transform existing `CriticalAlert` component so alerts are fetched from `/api/alerts` and are globally sticky on all pages until dismissed.
- **Why**: Technicians must see urgent information immediately.
- **Notes**: Respect dismiss-for-session logic (localStorage).

### 4.2 Hot Offers, Bulletins, Billing updates integration audit

- **Action**: Compare mocked JSON with real ValueGen/PBS data model; document required fields so future CMS import is straightforward.

---

## 5 · Search & Discovery Roadmap

### 5.1 Site-wide multilingual search (F82, F100)

- **What**: Replace simple in-memory search with Lunr or FlexSearch index generated at build time for both EN & FR terms; provide language filter chips.
- **Why**: High-priority story for quick, bilingual lookup.

### 5.2 Cross-domain federated search (F71)

- **What**: Add secondary results section that queries OneSource, telus.com/support, go/TOPPS APIs (mock for now) and merges into UI.
- **Challenges**: CORS, auth, latency – tackle with server-side proxy route.

### 5.3 Suggested/related content (F33)

- **What**: When viewing an article, call `/api/related?id=…` to display chips/cards for related resources.
- **Algorithm**: Tag & category similarity + manual overrides.

---

## 6 · Personalization & Regionalisation

### 6.1 User Preferences Panel UI (F68, F69, F95, F102)

- **What**: Build modal accessible from avatar icon allowing technicians to set:
  - Region (QC, AB-BC, etc.)
  - Preferred language
  - Role (Tech, Manager, Partner)
  - Skill designations
- **Why**: Drives personalized API filters already partially implemented.
- **Acceptance**: Updates `userPreferences` store and persists to localStorage.

### 6.2 Language toggle & auto-detect (F68, F116)

- **What**: Global toggle in top bar; on first visit detect browser `navigator.language` and set default.
- **Tech**: Use `@sveltejs/i18n`; keep keys in `/locales/en.json`, `/locales/fr.json`.

### 6.3 Region-specific content gating (F95, F99)

- **What**: Extend article front-matter with `regions` array; hide or grey-out content not matching user region.

---

## 7 · Offline & Mobile Support

### 7.1 Service Worker caching (F35, F50)

- **What**: Integrate Workbox to precache critical guides flagged as `offline: true` in metadata; honour "Download for offline" button per article.
- **Why**: Field technicians often work with spotty connectivity.

### 7.2 Offline toggle UI polish

- **Action**: Wire existing `OfflineToggle.svelte` to the service-worker mechanism and display storage usage stats.

---

## 8 · Bookmarks & Quick Access

### 8.1 Save/Unsave Article flow (F52, F105)

- **What**: Add star icon in article header that calls `userPreferences.toggleFavorite(id)`.
- **Why**: Enables fast retrieval from dashboard and persistent between devices once we add auth sync.
- **Acceptance**: Saved list appears in `UserQuickAccess` and a dedicated `/profile/favorites` route.

### 8.2 Recently viewed tracking (F30)

- **What**: Middleware records last 10 article IDs in `localStorage` and exposes via store for display on homepage.

---

## 9 · Navigation & UX

### 9.1 Sticky mini-TOC verification (F18)

- **Task**: Ensure `ArticleTOC.svelte` is included in all long-form article layouts and remains accessible on mobile (collapsible).

### 9.2 Breadcrumb component (F16)

- **What**: Add `Breadcrumb.svelte` that reflects current `page.url.pathname` segments and supports keyboard navigation.

### 9.3 Persistent floating quick-links menu (F7)

- **Audit**: Confirm `TopBar.svelte` satisfies story; if not, implement slide-out panel with categorized links (Apps, Job Aids, etc.).

---

## 10 · Security & Authentication

### 10.1 Single-Sign-On & VPN session persistence (F24, F25)

- **What**: Investigate TELUS OIDC flow; for mock-up, emulate auth token with expiry.
- **TODO**: Add interceptor to warn 5 min before token expiry (F27) and allow silent refresh.

---

## 11 · Training & Learning Management (Future Sprint)

This is a sizeable epics umbrella covering stories F128–F159. High-level steps:

1. Design data model for Learning Paths, Courses, Sessions.
2. Build `/training` routes with calendar (F156) and progress dashboards (F157).
3. Integrate deep links to TeamHub (F155).
4. Gamification layer (F158) – badges service.

---

## 12 · Accessibility & Compliance

- Conduct full WCAG 2.2 AA audit once components stabilise.
- Verify all interactive `div`s have keyboard handlers; prefer `<button>`/`<a>` per guidelines.
- Add ESLint plugin `eslint-plugin-jsx-a11y` equivalent for Svelte to catch regressions.

---

## How to work this board

1. Create a feature branch named `feat/<topic>`.
2. Break tasks further into issues & PRs referencing the numbered sections above.
3. Keep this `TODO.md` updated – **it is the source of truth** until we migrate to Jira / GitHub Projects.

---

## 13 · Log Files

For the purposes of testing our mockup and ensuring all the required links are working, we need to create a log file that will be used in future AI prompting steps to fix broken links, finish missing pages, etc.

- Create a log file that will be used in future AI prompting steps to fix broken links, finish missing pages, etc.
- The log file should be created in the root of the project and named `log.md`
- Each log entry should only be created for issues like a 404 not found, and should include the following information:
  - The URL that was accessed
  - The status code of the response
  - A timestamp
  - A description of the issue
  - A suggestion for a fix
  - A link to the documentation for the issue

---

## 14 · Fix legacy items and update to the Svelte 5 way.

```svelte
<script>
  $: showNewBadge = isNew(publishDate);
	$: showUpdatedBadge = isUpdated(publishDate, lastUpdated);
</script>
```

This was the old way of doing it. Computed and derived values should now use the `$derived` or `$effect` directives.

```svelte
<script>
  let { publishDate, lastUpdated } = $props();

  const showNewBadge = $derived(isNew(publishDate));
  const showUpdatedBadge = $derived(isUpdated(publishDate, lastUpdated));
</script>
```

We'll need to look at each .svelte file and update the computed and derived values to use the `$derived` or `$effect` directives the appropriate way. Look at Svelte 5 documentation for examples if you need additional information. We should also write rules to our .cursorrules file to ensure we don't make the same mistakes in newly generated code.

---

## 15 · Fix event handling to use the new Svelte 5 way.

In Svelte 5, event handlers are now defined using the `$listener` rune instead of `on:event`, allowing better reactivity and integration with the new runes system. Here's how you'd convert your example to the new syntax:

### **Old Svelte 3/4 way (legacy):**

```svelte
<div
	class="modal-backdrop"
	on:click={() => toggleModal(false)}
	on:keydown={(e) => e.key === 'Escape' && toggleModal(false)}
	tabindex="0"
	role="button"
	aria-label="Close modal"
>
```

---

### **New Svelte 5 way (with `$listener`):**

```svelte
<script>
	const handleClick = $listener(() => toggleModal(false));
	const handleKeydown = $listener((e) => {
		if (e.key === 'Escape') toggleModal(false);
	});
</script>

<div
	class="modal-backdrop"
	use:handleClick
	use:handleKeydown
	tabindex="0"
	role="button"
	aria-label="Close modal"
>
```

---

### Rule Summary:

- **Old way**: Use `on:event` directly in markup with inline or referenced functions.
- **Svelte 5 way**: Use `$listener(fn)` to define event handlers and `use:` to apply them to elements.

Lastly, write a rule to our .cursorrules file to ensure we don't make the same mistakes in newly generated code.

---

## 16 · add a way to dismiss system alerts

There should be an confirm box that ensures the user has read, understands, and wants to dismiss the alert. Users should not be just dismissing to make the visual noise go away.

Ideally, the alert will stay dismissed. But, for the sake of mockup, let's have a button that restores the alerts. Let's keep this button small and minimal, but in the same area as the alerts.
