# Your link page

A responsive, accessible Linktree-style page made with plain HTML and CSS. No backend, package installation, build step, external fonts, or tracking. A small optional browser script powers the link editor. All assets are local or embedded.

## Preview

Open `index.html` in your browser. It works directly from disk.

Optional local server, if Python 3 is installed:

```sh
cd link-page
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Make it yours

1. In `index.html`, replace Alex Morgan, the initials, handle, introduction, footer, title, and description. Search for `CUSTOMIZE` to find the main editing points.
2. Replace **every** `https://example.com/...` link and `hello@example.com` with your real destinations. These are sample destinations, not live profile pages.
3. Edit the text inside each link. Duplicate or remove an entire `<a class="link-card">...</a>` block to add or remove links. Keep descriptive labels so visitors know where each link goes.
4. Change the colors at the top of `styles.css`. Check text contrast after changing colors.
5. Optional: replace the avatar `<div>` with `<img class="avatar" src="profile.jpg" alt="" width="80" height="80">` and place your photo alongside `index.html`. Empty alt text avoids repeating the adjacent name.
6. Update the embedded favicon in the HTML head if you want a different initial or color.

Links open in the same tab for predictable browser behavior. If you choose to add `target="_blank"`, also add `rel="noopener noreferrer"` and tell visitors the link opens in a new tab.

## Deploy on Vercel

1. Put this folder in a Git repository and push it to your Git provider.
2. In Vercel, add a new project and import that repository.
3. Set **Root Directory** to `link-page` if the repository contains this parent workspace. If you upload only this folder’s contents as the repository, leave the root at the repository root.
4. Choose the **Other** framework preset. Leave the build command empty; serve the project root (`.`) as the output directory. No installation command or environment variables are needed.
5. Deploy. Vercel provides a URL, and you can add a custom domain in the project settings.

Alternatively, with the Vercel CLI already installed, run `vercel` from inside `link-page` and follow its prompts. Run `vercel --prod` when ready to publish to production.

Vercel configuration is included in `vercel.json` to explicitly select static hosting with no build step. Never place secrets in this folder: static files are public after deployment.

## Accessibility and maintenance

Semantic landmarks, descriptive link labels, visible keyboard focus, touch-friendly cards, reduced-motion support, responsive sizing, and system fonts are included. Use Tab and Enter to navigate. There is no analytics, email form, or subscription service; the email link opens the visitor’s email application. Updating the page means editing these files and redeploying.

Deployment settings follow [Vercel’s build configuration documentation](https://vercel.com/docs/builds/configure-a-build) and [static configuration reference](https://vercel.com/docs/project-configuration/vercel-json).

Verified in Chrome at 320, 390, 768, and 1440 pixel viewport widths, with no horizontal overflow; also checked keyboard focus, 200% text sizing, and absence of page errors. Replace the sample links before sharing publicly.

## Browser-only editor (feature branch)

Choose **Edit my links** to change link titles, destinations, descriptions, and button labels. Add, remove, and reorder up to 30 links. Save changes stores a draft in this browser’s local storage and updates the page on this device. Refreshing preserves the draft when browser storage is available. No accounts, backend, or shared writes are involved. Other visitors still see the published links; clearing browser data removes the local draft. Do not put sensitive information in link drafts.

**Download page** exports the current valid form as an `index.html` with the edited links. Keep `styles.css` alongside the download. The exported page omits the editor and requires no JavaScript. Replace the repository’s page and push when you want to publish it. Saving in the editor never publishes automatically. If browser storage is blocked, use the download to preserve your edits.

The editor accepts full HTTP(S), email (`mailto:`), and phone (`tel:`) destinations; executable URLs are rejected. Text is inserted as text, not interpreted as HTML. The original page still works when JavaScript is disabled, although editing requires JavaScript.
