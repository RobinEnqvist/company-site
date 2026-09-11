# company-site

Homepage for the company. Work in progress, password-locked.

- `src/homepage.html` — the page source (edit this)
- `build.mjs` — encrypts the source with a password and writes `index.html`
- `index.html` — the published, self-decrypting page (never edit by hand)

## Rebuild after editing

```bash
SITE_PASSWORD='<password>' node build.mjs
```

Then commit `index.html`. The password is never stored in the repo — the page
holds only an AES-GCM ciphertext and a PBKDF2 salt.
