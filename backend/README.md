# Backend Setup

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
SERVER_PORT=3001
CLIENT_PORTS=http://localhost:3000
CLIENT_URL=http://localhost:3000

# Database Configuration
DB_URI=mongodb://localhost:27017
DB_NAME=blog_app

# Database Collections
DB_COLLECTION_USERS=users
DB_COLLECTION_POSTS=posts
DB_COLLECTION_COMMENTS=comments
DB_COLLECTION_REFRESH_TOKENS=refresh_tokens
DB_COLLECTION_CHATS=chats
DB_COLLECTION_IMAGES=images
DB_COLLECTION_VIDEO=videos
DB_COLLECTION_MESSAGE=messages
DB_COLLECTION_FAVORITES=favorites
DB_COLLECTION_LIKES=likes
DB_COLLECTION_REPORTS=reports

# Cloudinary Configuration (Required for image upload)
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_AUTH_USER=your_email@gmail.com
EMAIL_AUTH_PASS=your_email_password
EMAIL_SERVICE=gmail
EMAIL_SERCURE=true

# JWT Configuration
ACCESS_TOKEN_SECRET_KEY=your_access_token_secret_key_here
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret_key_here
REFRESH_TOKEN_EXPIRES_IN=7d

# Email Verification
EMAIL_VERIFICATION_SECRET_KEY=your_email_verification_secret_key_here
EMAIL_VERIFY_TOKEN_EXPIRES_IN=15m

# Password Reset
FORGOT_PASSWORD_SECRET_KEY=your_forgot_password_secret_key_here
FORGOT_PASSWORD_TOKEN_EXPIRES_IN=15m

# Password Hashing
HASH_PASSWORD_SECRET=your_password_hash_secret_here
```

## Cloudinary Setup

1. Sign up for a free Cloudinary account at https://cloudinary.com/
2. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Update the `.env` file with your Cloudinary credentials

## Installation

```bash
npm install
```

## Running the Server

```bash
npm run dev
```

The server will start on port 3001 (or the port specified in your .env file).

## Image Upload

The image upload functionality requires Cloudinary credentials to be properly configured. If you see the error "Must supply api_key", make sure your `.env` file contains the correct Cloudinary credentials.
