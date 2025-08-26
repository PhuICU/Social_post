const fs = require("fs");
const path = require("path");

const envContent = `SERVER_PORT=5000
CLIENT_PORTS=http://localhost:3000
CLIENT_URL=http://localhost:3000
DB_URI=mongodb://localhost:27017
DB_NAME=your_database_name
HASH_PASSWORD_SECRET=your_hash_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
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
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_AUTH_USER=your_email@gmail.com
EMAIL_AUTH_PASS=your_email_password
EMAIL_SERVICE=gmail
EMAIL_SERCURE=false
ACCESS_TOKEN_SECRET_KEY=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
EMAIL_VERIFY_TOKEN_EXPIRES_IN=10m
FORGOT_PASSWORD_TOKEN_EXPIRES_IN=10m
REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret
EMAIL_VERIFICATION_SECRET_KEY=your_email_verification_secret
FORGOT_PASSWORD_SECRET_KEY=your_forgot_password_secret
`;

const envPath = path.join(__dirname, ".env");

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log(".env file created successfully!");
  console.log(
    "Please update the values in the .env file with your actual configuration."
  );
} else {
  console.log(".env file already exists.");
}
