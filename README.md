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

### Manual deployment

```bash
cd Frontend
pnpm build
firebase deploy --only hosting
```

Requires `firebase-tools` installed globally (`npm install -g firebase-tools`) and `firebase login` run once.

### Automatic deployment

The GitHub Actions workflow deploys `Frontend/` to Firebase Hosting after every push to `main`. It can also be started manually from the repository's **Actions** tab.

To enable it, create a Firebase service-account key and add its complete JSON contents as a GitHub repository secret named `FIREBASE_SERVICE_ACCOUNT_AHEGS_TRACKER_3038A`:

1. Open Firebase Console > Project settings > Service accounts.
2. Click **Generate new private key** and download the JSON file.
3. In GitHub, open the repository's Settings > Secrets and variables > Actions > New repository secret.
4. Set the name to `FIREBASE_SERVICE_ACCOUNT_AHEGS_TRACKER_3038A` and paste the JSON contents as the value.

After that, merge or push a commit to `main`. The workflow builds the Vite app and deploys the `Frontend/dist` output to the `ahegs-tracker-3038a` Hosting site.
