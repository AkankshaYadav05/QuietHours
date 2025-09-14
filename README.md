# Quiet Hours Scheduler

A Next.js application for scheduling focused study sessions with automated email reminders.

## Features

- 🔐 User authentication with JWT
- 📅 Schedule quiet study blocks
- 📧 Email notifications 10 minutes before sessions
- 🚫 Overlap prevention for notifications
- 📱 Responsive design
- 🎨 Beautiful, calming UI

## Tech Stack

- **Frontend**: Next.js 13, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with bcryptjs
- **Email**: Configurable (SendGrid, AWS SES, Resend, SMTP)

## Setup

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

3. **MongoDB Setup**:
   - Create a MongoDB database (MongoDB Atlas recommended)
   - Add your connection string to `MONGODB_URI`

4. **Email Service Setup**:
   Choose and configure one email service in `lib/emailService.js`:
   - SendGrid
   - AWS SES
   - Resend
   - SMTP (Gmail, etc.)

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## Email Notifications

The app includes a CRON endpoint at `/api/cron/email-notifications` that should be called every minute to send email reminders.

### Production CRON Setup

Set up a CRON job to call the endpoint:

```bash
* * * * * curl -X GET "https://your-domain.com/api/cron/email-notifications" \
  -H "Authorization: Bearer your-cron-secret"
```

### Alternative CRON Services

You can also use services like:
- **Vercel Cron** (if deploying to Vercel)
- **GitHub Actions** with scheduled workflows
- **External CRON services** like cron-job.org
- **Cloud Functions** with scheduled triggers

### Testing CRON Locally

In development mode, you'll see a "Test CRON" button in the dashboard to manually trigger the email notification check.

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

### Quiet Blocks Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  title: String,
  description: String,
  startTime: Date,
  endTime: Date,
  emailSent: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification
- `GET /api/quiet-blocks` - Get user's quiet blocks
- `POST /api/quiet-blocks` - Create new quiet block
- `DELETE /api/quiet-blocks/[id]` - Delete quiet block
- `GET /api/cron/email-notifications` - CRON endpoint for email notifications

## Deployment

1. Deploy to your preferred platform (Vercel, Netlify, etc.)
2. Set up environment variables in your deployment platform
3. Configure your email service
4. Set up CRON job for email notifications
5. Update MongoDB connection for production

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- CRON endpoint authentication
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.