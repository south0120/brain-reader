# Privacy Policy - Brain Reader

Last updated: April 16, 2026

## Overview

Brain Reader ("the Extension") is a Chrome extension that enhances the reading experience on brain-market.com. This privacy policy explains how the Extension handles user data.

## Data Collection

The Extension does **NOT** collect, transmit, or share any personal data with external servers.

## Data Storage

All data created by the Extension is stored locally on the user's device:

- **localStorage**: Bookmarks, highlights, notes, reading progress, and scroll position are stored in the browser's localStorage, scoped to the brain-market.com domain.
- **chrome.storage.sync**: Learning activity logs (calendar data) are synced across the user's Chrome profile devices via Chrome's built-in sync mechanism. This data never leaves Google's infrastructure.

## Data Types Stored

| Data | Storage | Purpose |
|------|---------|---------|
| Bookmarks | localStorage | Save reading positions |
| Highlights & Notes | localStorage | User-created text annotations |
| Read sections | localStorage | Track learning progress |
| Scroll position | localStorage | Resume reading |
| Activity log (calendar) | localStorage + chrome.storage.sync | Learning streak tracking |

## Third-Party Services

The Extension does not communicate with any third-party servers. The only external interaction is when users voluntarily share their learning streak or highlights on X (Twitter) via the share button, which opens the X website in a new tab.

## Data Deletion

Users can delete all stored data at any time through the Extension's settings panel ("全データ削除" button).

## Permissions Used

| Permission | Reason |
|------------|--------|
| `storage` | To sync learning activity across devices via chrome.storage.sync |
| `clipboardWrite` | To copy highlight summaries to clipboard (Markdown export) |

## Contact

For questions about this privacy policy, please create an issue on the GitHub repository:
https://github.com/south0120/brain-reader

## Changes

We may update this privacy policy from time to time. Changes will be posted on this page.
