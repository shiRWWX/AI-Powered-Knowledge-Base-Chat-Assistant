/**
 * Seed Script
 * Populates MongoDB with sample knowledge base articles
 * Run with: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge_base';

const sampleArticles = [
  {
    title: 'Getting Started with Our Product',
    content: `Welcome to our platform! This guide will help you get started quickly.
    
Our product is designed to help you manage your workflow efficiently. To begin:
1. Create an account by clicking the sign-up button
2. Verify your email address
3. Complete your profile setup
4. Start exploring features

For any questions, feel free to contact our support team.`,
    tags: ['getting-started', 'onboarding', 'basics'],
    createdAt: new Date()
  },
  {
    title: 'API Documentation Overview',
    content: `Our API provides a comprehensive set of endpoints for integrating with our platform.

Key Features:
- RESTful API design
- JSON responses
- Authentication via API keys
- Rate limiting for fair usage
- Comprehensive error handling

Base URL: https://api.example.com/v1

All requests must include your API key in the header:
Authorization: Bearer YOUR_API_KEY

For detailed endpoint documentation, please refer to our API reference guide.`,
    tags: ['api', 'documentation', 'integration', 'developer'],
    createdAt: new Date()
  },
  {
    title: 'How to Reset Your Password',
    content: `Forgot your password? No worries! Follow these simple steps to reset it:

1. Go to the login page
2. Click on "Forgot Password" link
3. Enter your registered email address
4. Check your email for a password reset link
5. Click the link and create a new password
6. Make sure your new password is strong and secure

If you don't receive the email, check your spam folder or contact support.

Security Tip: Use a combination of uppercase, lowercase, numbers, and special characters for a strong password.`,
    tags: ['password', 'security', 'account', 'help'],
    createdAt: new Date()
  },
  {
    title: 'Subscription Plans and Pricing',
    content: `We offer flexible subscription plans to meet your needs:

Free Plan:
- Basic features
- Limited storage (5GB)
- Community support
- Perfect for individuals

Pro Plan ($9.99/month):
- All basic features
- Unlimited storage
- Priority support
- Advanced analytics
- API access
- Ideal for professionals

Enterprise Plan (Custom pricing):
- Everything in Pro
- Dedicated account manager
- Custom integrations
- SLA guarantees
- Team collaboration features
- Best for businesses

You can upgrade or downgrade your plan at any time from your account settings.`,
    tags: ['pricing', 'subscription', 'plans', 'billing'],
    createdAt: new Date()
  },
  {
    title: 'Troubleshooting Common Issues',
    content: `Encountering problems? Here are solutions to common issues:

Issue: Cannot log in
Solution: Verify your email and password. Try resetting your password if needed.

Issue: Slow performance
Solution: Clear your browser cache, check your internet connection, or try a different browser.

Issue: Features not working
Solution: Make sure you're using a supported browser (Chrome, Firefox, Safari, Edge). Disable browser extensions that might interfere.

Issue: Payment not processing
Solution: Verify your payment method, check for sufficient funds, and ensure your card hasn't expired.

If none of these solutions work, please contact our support team with details about your issue.`,
    tags: ['troubleshooting', 'help', 'support', 'issues'],
    createdAt: new Date()
  },
  {
    title: 'Data Security and Privacy',
    content: `Your data security and privacy are our top priorities.

Security Measures:
- End-to-end encryption for all data
- Regular security audits
- SSL/TLS encryption for all connections
- Secure data centers with 24/7 monitoring
- Regular backups of all data

Privacy Policy:
- We never sell your data to third parties
- You control what data you share
- GDPR and CCPA compliant
- Transparent data practices
- Right to data deletion

Data Retention:
- Active accounts: Data retained while account is active
- Deleted accounts: Data deleted within 30 days
- You can request immediate deletion by contacting support

For more information, please review our complete Privacy Policy and Terms of Service.`,
    tags: ['security', 'privacy', 'data', 'compliance'],
    createdAt: new Date()
  },
  {
    title: 'Integration with Third-Party Tools',
    content: `Connect our platform with your favorite tools and services.

Supported Integrations:
- Slack: Get notifications and updates in your Slack workspace
- Zapier: Connect with 3000+ apps and automate workflows
- Google Workspace: Sync with Google Drive, Calendar, and Gmail
- Microsoft 365: Integrate with Office 365 and Teams
- GitHub: Track development activities and deployments
- Jira: Sync project management tasks

How to Set Up:
1. Go to Settings > Integrations
2. Choose the service you want to connect
3. Authorize the connection
4. Configure your preferences
5. Start using the integration

Need help setting up an integration? Check our integration guides or contact support.`,
    tags: ['integrations', 'tools', 'automation', 'connectivity'],
    createdAt: new Date()
  },
  {
    title: 'Mobile App Features',
    content: `Access our platform on the go with our mobile apps.

Available for:
- iOS (iPhone and iPad)
- Android phones and tablets

Key Features:
- Full feature parity with web version
- Push notifications
- Offline mode for viewing content
- Biometric authentication
- Optimized for mobile workflows

Download:
- iOS: Available on the App Store
- Android: Available on Google Play Store

App Requirements:
- iOS 13.0 or later
- Android 8.0 or later
- Internet connection for syncing

The mobile app automatically syncs with your web account, so all your data is available everywhere.`,
    tags: ['mobile', 'app', 'ios', 'android'],
    createdAt: new Date()
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing articles (optional - comment out if you want to keep existing data)
    await Article.deleteMany({});
    console.log('🗑️  Cleared existing articles');

    // Insert sample articles
    const insertedArticles = await Article.insertMany(sampleArticles);
    console.log(`✅ Inserted ${insertedArticles.length} articles`);

    // Create text index if it doesn't exist
    try {
      await Article.collection.createIndex({ title: 'text', content: 'text' });
      console.log('✅ Text index created');
    } catch (error) {
      if (error.code !== 85) { // Index already exists
        throw error;
      }
      console.log('✅ Text index already exists');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();



