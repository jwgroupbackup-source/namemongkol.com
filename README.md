This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

## SEO/AEO Image Alt

Use the project guideline for writing alt text:

- [docs/seo-alt-guideline.md](docs/seo-alt-guideline.md)

## Member Tier Policy

- Membership levels: `free`, `pro`, `vvip`
- For now, topup payment does **not** auto-upgrade member tier
- Admins can manually set member tier in Admin Users page
- Member tier has no expiry in current policy
- Admin Users page supports filtering by member tier
- Tier changes are stored in `member_tier_history` for audit tracking

## Push to GitHub

Use this standard flow:

```bash
git status
git add .
git commit -m "chore: update CI/CD and SEO alt improvements"
git push origin main
```

If you prefer PR flow:

```bash
git checkout -b feat/cicd-vercel
git add .
git commit -m "ci: add github actions and vercel deploy workflow"
git push -u origin feat/cicd-vercel
```

## Deploy to Vercel (via GitHub Actions)

Workflows:

- [.github/workflows/ci.yml](.github/workflows/ci.yml)
- [.github/workflows/deploy-vercel.yml](.github/workflows/deploy-vercel.yml)

Required GitHub repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

How to get them:

1. Run `vercel login`
2. Run `vercel link` in this project once
3. Read values from `.vercel/project.json` (`orgId` and `projectId`)
4. Create token at Vercel dashboard: Settings > Tokens

Deploy behavior:

1. `CI` runs on push and pull request to `main`
2. `Deploy to Vercel` runs on push to `main` (and manual dispatch)
3. Deployment uses `vercel pull`, `vercel build`, and `vercel deploy --prebuilt`

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
