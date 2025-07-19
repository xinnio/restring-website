# Markham Restring Studio

A Next.js-based racket stringing service website with booking management, inventory tracking, and admin dashboard.

## Features

- **Booking System**: Complete booking form with multiple racket support
- **Inventory Management**: Track strings and availability
- **Admin Dashboard**: Manage bookings, inventory, and availability
- **Email Notifications**: Automatic email alerts for new bookings
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live availability and booking status

## Email Setup

The booking system automatically sends detailed booking notifications to `markhamrestring@gmail.com` when customers submit bookings.

### Option 1: EmailJS (Recommended - No Server Setup)

1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template
4. Add environment variables to your `.env.local`:

```env
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_USER_ID=your_user_id
```

5. Uncomment the EmailJS code in `src/app/api/email/route.js`

### Option 2: SendGrid

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Get your API key
3. Add to `.env.local`:

```env
SENDGRID_API_KEY=your_api_key
```

4. Update the email route to use SendGrid

### Option 3: Mailgun

1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Get your API key and domain
3. Add to `.env.local`:

```env
MAILGUN_API_KEY=your_api_key
MAILGUN_DOMAIN=your_domain
```

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file with:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
# Email service variables (see Email Setup above)
```

## Email Content

The booking notification email includes:

- Customer information (name, email, phone)
- Complete racket and string details
- Service options (turnaround time, locations)
- Pricing breakdown
- Additional notes
- Booking ID and status

The email is sent to `markhamrestring@gmail.com` with a subject line like:
`🎾 New Booking - John Doe - Same Day`
