# 🛒 Grocery List

A **mobile-first grocery assistant PWA** designed to be much more than a simple checklist. It helps you build shopping lists, organize groceries, plan meals, track prices, work offline, and optionally sync data with Supabase.

> **Goal:** Make grocery shopping faster, easier, and more organized without requiring an app-store download.

## ✨ What is this?

Grocery List is a browser-based grocery assistant that works especially well on phones. It can be installed as a Progressive Web App (PWA), so it can feel like a normal app while still being a website.

The project uses a **local-first approach**: basic grocery-list functionality is stored in the browser, while optional cloud features use Supabase.

## 🚀 Main features

### 🛒 Grocery lists

- Add, edit, and remove groceries
- Mark items as bought/unbought
- Quantities and units
- Notes
- Brands
- Prices
- Categories
- Favorites
- Quick adding
- Quantity parsing such as `3 apples`
- Automatic category suggestions
- Search by item, category, brand, or notes
- Shopping progress
- Estimated grocery total
- Multiple-list foundation
- Undo deleted items
- Shopping Mode

### 📱 Mobile-first design

- Large touch targets
- Mobile-friendly controls
- Responsive portrait and landscape layouts
- Bottom navigation
- Floating add button
- Dark mode
- Light mode
- System theme
- Large-text mode
- Accessibility-friendly controls
- One-handed-friendly layout

### 🛍️ Shopping Mode

Shopping Mode focuses the screen on the groceries you still need.

- Shows shopping progress
- Places unbought items first
- Quickly marks items purchased
- Keeps the screen awake where supported
- Optional completion sound
- Completion celebration

### 🍎 Meals

- Store meals
- Store recipe ingredients
- Add recipe ingredients to the grocery list
- Meal planning foundation

### 💾 Local/offline support

- Browser-local storage
- Offline-friendly PWA architecture
- Service worker
- Installable from the browser
- Local JSON backup/export

### ☁️ Supabase cloud features

The project includes a Supabase backend foundation for:

- Authentication
- Cloud grocery data
- Grocery lists
- List members
- Stores
- Store departments/aisles
- Recipes
- Meal plans
- Shopping trips
- Receipts
- Price history
- Activity history
- Realtime grocery-item updates
- Row Level Security

Cloud functionality is optional; the basic list can remain local-first.

## 🐛 Bug fixes and audit record

A full code audit was performed and the following bugs/problems were identified for tracking in [GitHub Issue #1](https://github.com/b3434474-art/Grocery-list/issues/1):

### 1. Cloud deletion synchronization

**Problem:** Deleting a grocery item locally could leave the corresponding item in Supabase.

**Fix:** Cloud synchronization needs to compare the remote set with the local set before removing stale cloud records, rather than only considering IDs that were just uploaded.

### 2. Shared-list links

**Problem:** The app could generate a `#shared=...` URL, but opening that URL did not automatically consume the shared data.

**Fix:** Shared-link handling must read the URL hash on startup and load/validate the shared list before displaying it.

### 3. Deleted-item history

**Problem:** Normal deletion used temporary Undo data but did not reliably add deleted items to persistent recovery history.

**Fix:** Deletion should record the item in history before removing it, allowing the History/Restore feature to recover it later.

### 4. Service-worker asset fallback

**Problem:** A failed request for a CSS, JavaScript, image, or other asset could receive `index.html` as the fallback response. That can cause the browser to interpret HTML as an asset and break the app.

**Fix:** The offline fallback should be restricted to navigation/document requests. Static assets should fail normally or use an appropriate cached asset.

### 5. Multiple-list cloud synchronization

**Problem:** Cloud synchronization was tied too closely to a single/default list.

**Fix:** Synchronization needs to identify and sync each grocery list independently rather than always selecting the first list.

### 6. Sync conflict handling

**Problem:** A remote pull could replace local data without considering changes made locally while offline.

**Fix:** A proper sync queue/conflict strategy is required so unsynced local changes are not silently overwritten.

### 7. Reminder behavior

**Problem:** Notification permission/display support is not the same as a real scheduled reminder system.

**Fix:** Reminder functionality should only be advertised when actual scheduling and delivery are implemented and supported by the browser/environment.

## ⚠️ Feature honesty

This project intentionally does **not** pretend that unavailable external services are working.

Some ideas require additional infrastructure or external data sources, for example:

- Product identification from barcodes requires a product database/API.
- Receipt OCR requires an OCR service or suitable local OCR implementation.
- Full geofencing depends on platform/browser capabilities and background execution support.
- AI grocery assistance requires an AI service or locally available model.
- Robust real-time multi-user conflict resolution requires additional synchronization logic.

If a feature cannot genuinely work with the current GitHub + Supabase + browser setup, it should not be presented as fully implemented.

## 🧱 Technology

- HTML
- CSS
- JavaScript
- Progressive Web App APIs
- Service Worker
- Browser Local Storage
- Supabase
- PostgreSQL through Supabase
- Supabase Auth
- Supabase Realtime
- Row Level Security

## 🔐 Privacy approach

The app is designed around a local-first model:

- No account is required for basic local use.
- Grocery data can remain in the browser.
- Cloud synchronization is optional.
- Users should be able to export their data.
- Supabase access should use browser-safe publishable credentials, never a service-role secret in frontend code.

## 📂 Important files

| File | Purpose |
|---|---|
| `index.html` | Main application interface |
| `app.js` | Core grocery-list behavior |
| `features.js` | Additional grocery features |
| `cloud-sync.js` | Supabase authentication/synchronization |
| `supabase.js` | Supabase client configuration |
| `sw.js` | PWA service worker/offline behavior |
| `manifest.webmanifest` | PWA installation metadata |
| `styles.css` | Application styling |

## 📲 Using it

Open the website in a modern browser. On supported mobile browsers, use **Add to Home Screen** or the browser's install option to install the PWA.

Basic list functionality is designed to work without an account. Cloud features require the Supabase setup to be available and configured.

## 🔧 Development

This is a static web application with optional Supabase services. Changes should be tested in both online and offline conditions, especially when modifying storage, synchronization, or the service worker.

### Before submitting a change

- Test adding/editing/deleting items.
- Test bought/unbought state.
- Test refresh and browser restart.
- Test offline behavior.
- Test Supabase sign-in/sync when configured.
- Test multiple lists when modifying list functionality.
- Check the browser console for errors.
- Test on a phone-sized viewport.
- Avoid adding UI controls for features that are not actually functional.

## 📋 Roadmap

Potential future work includes fully implementing the backend-powered parts of the grocery assistant, including stores and aisles, recurring groceries, complete shared lists, purchase history, budgets, receipts, meal planning, statistics, and robust multi-device synchronization.

## 📄 License

Add a license here if you decide to publish this project under a specific open-source license.
