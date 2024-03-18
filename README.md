This is a project boilerplate containing
- `/app` vite frontend
- `/api` vercel api folder for serverless/edge actions
- `/server` trpc actions
- tailwind for styling

It's meant to be deployed on vercel with the following settings:
- Base path: `./`
- Build command: `pnpm -F app build`
- Dev command: `pnpm -F app dev`
- Output directory: `./app/dist`

To develop, you'll want to run `vercel dev` and setup a project so that the API functions work.
