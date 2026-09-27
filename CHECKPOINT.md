# Website management checkpoint

Saved at the owner's request before completing upload testing.

## Included
- Database-driven ceremony catalogue and booking choices, including Durga Path.
- Owner service editor, enable/disable, categories and ordering at /admin/manage.
- Owner gallery editor and single-player public gallery backed by Neon.
- Text reviews, rating, publication permission, owner moderation at /reviews.
- Updated education wording without an invented graduation year.
- Cloudinary signed-upload implementation and authenticated pending attachments.
- Additive Neon migration and initial service/legacy-video seed completed.

## Deliberately disabled
Uploads are gated by MEDIA_UPLOADS_ENABLED=true AND the three Cloudinary
environment variables. The flag is off by default; do not enable it until the
remaining tests below pass. Supplied Cloudinary credentials are only in the
ignored local .env.local, not Git or Vercel. Restricted upload presets were
created successfully in the supplied Cloudinary account.

## Next session
1. Rotate the Cloudinary secret that was shared in chat, then securely update
   local and approved Vercel environment settings. Never commit credentials.
2. Verify image/video upload, Cloudinary preset enforcement, pending-file privacy,
   owner previews, approval, hiding, deletion, retries, and quota enforcement.
3. Test text-review submission and moderation, service edits and disabled-service
   rejection, existing booking creation/tracking, and admin authentication.
4. Verify desktop/mobile rendering and keyboard accessibility in a browser.
5. Add upload-recovery regression tests, check abandoned uploads and quota cleanup,
   and consider stronger bot verification before opening public attachments.
6. Enable uploads only after these checks, then redeploy and test production.

Service and review records are in Neon. Do not re-run seed-content.mjs on every
deploy: re-running it can restore deleted legacy gallery entries. Daily upload
reservations are capped at 160 MB, independent of actual Cloudinary free credits.
Hidden media's previously distributed signed URLs may still be usable; permanent
removal uses Cloudinary deletion with invalidation. Do not claim hiding revokes
previously shared links immediately.
