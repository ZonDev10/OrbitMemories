# Orbit Memories

Orbit Memories is a static HTML, CSS, and JavaScript prototype. It has no build step or package installation.

## Publish with GitHub Pages

1. Create a GitHub repository. For the simplest free Pages setup, make it public.
2. Upload the project files to the repository root. Keep `index.html`, `style.css`, `script.js`, `vault.html`, `forgot-password.html`, and `create-account.html` together in the root folder.
3. Open the repository's **Settings** and select **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/(root)` folder, then save.
6. Wait for the Pages deployment to finish. The site address will be `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

The site uses relative page and asset links, so it works from the repository subpath. There is no `npm install` or build command. Future commits to the selected branch update the published site.

## Important prototype limits

This is not a secure online vault or production login system. Accounts and passwords are stored in browser `localStorage`, and photos/videos are stored in browser IndexedDB on the device that added them. They do not sync to a server, and the site does not send registration or password-reset emails.

Because GitHub Pages publishes the JavaScript to the public web, do not use real passwords or upload sensitive media. Real user accounts, email verification/reset, and private cross-device media storage require a backend, authentication provider, email service, and access rules before launch.