# Kashi Aarti Wale

A responsive full-stack booking website for authentic Kashi-style Ganga Aarti ceremonies at weddings, family rituals, homes, and event venues.

## Features

- Responsive ceremony and video experience
- Booking requests with reference numbers
- Customer booking tracking
- Password-protected owner dashboard
- Booking search, filters, and status workflow
- Secure sessions and login throttling
- WhatsApp booking support

## Local development

Requirements: Node.js 22.13 or newer and pnpm 11.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

The owner dashboard is available at `/admin`. Configure the ignored `.dev.vars` file as described in `ADMIN_SETUP.md`.

## Database

Database migrations are stored in `drizzle/` and must be applied in filename order.

## Security

Secrets, local databases, dependencies, and build output are excluded from Git. Never commit `.dev.vars` or plaintext passwords.
