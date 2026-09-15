# WIESOC AHEGS Tracker

A web app for WIESOC Industry Mentoring Program members to log volunteering hours, submit evidence, and track progress toward the AHEGS requirement. Admins can review, approve, or reject submissions.

## Tech stack

- **Frontend**: React + TypeScript, built with Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Icons**: lucide-react


## Getting started

### Prerequisites

- Node.js (v18+)
- pnpm (`npm install -g pnpm` if you don't have it)

### Setup

```bash
pnpm install
pnpm dev
```

## Deployment

```bash
pnpm build
firebase deploy --only hosting
```

Requires `firebase-tools` installed globally (`npm install -g firebase-tools`) and `firebase login` run once.
