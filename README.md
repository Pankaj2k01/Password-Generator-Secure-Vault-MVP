# Password Vault - Secure Password Manager

A secure, privacy-first password manager built with Next.js, TypeScript, and MongoDB. Features client-side encryption to ensure your passwords are never stored in plaintext on the server.

## 🚀 Features

### Must-Have Features ✅
- **Password Generator**: Customizable length (8-64), character types (uppercase, lowercase, numbers, symbols), exclude look-alike characters
- **Simple Authentication**: Email + password registration and login
- **Vault Management**: Store title, username, password, URL, and notes for each entry
- **Client-Side Encryption**: All vault data is encrypted before being sent to the server using AES-256
- **Copy to Clipboard**: Auto-clear clipboard after 15 seconds for security
- **Search & Filter**: Real-time search across titles, usernames, and URLs

### Security Features 🔒
- **Zero-Knowledge Architecture**: Server never sees plaintext passwords or vault data
- **PBKDF2 Key Derivation**: 10,000 iterations for password hashing and encryption key generation
- **JWT Authentication**: Secure token-based authentication
- **Auto-Logout**: Session management with secure token storage

### UI/UX Features ✨
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic dark/light mode based on system preference
- **Minimal & Fast**: Clean interface with instant password generation
- **Loading States**: Smooth user experience with loading indicators

## 🛠 Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: MongoDB
- **Authentication**: JWT tokens, bcryptjs
- **Encryption**: crypto-js (AES-256, PBKDF2)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom components

## 📖 Crypto Implementation

**Library Used**: `crypto-js`

**Why crypto-js?**
- Mature, well-tested library with extensive documentation
- Provides AES-256 encryption and PBKDF2 key derivation out of the box
- Client-side encryption ensures zero-knowledge architecture where server never sees plaintext data

**Security Details**:
- **Encryption**: AES-256 in CBC mode
- **Key Derivation**: PBKDF2 with 10,000 iterations
- **Salt**: Unique per-user salt for key derivation
- **Architecture**: All sensitive data is encrypted on the client before transmission

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB instance (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd password-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/password-vault
   NEXTAUTH_SECRET=your-secret-key-change-this-in-production
   NEXTAUTH_URL=http://localhost:3000
   JWT_SECRET=your-jwt-secret-change-this-in-production
   ENCRYPTION_KEY=your-32-character-encryption-key-change-this
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔄 Usage Flow

### 1. Registration/Login
- Create an account with email and password
- Password must be at least 8 characters with letters and numbers
- Automatic encryption key generation based on your master password

### 2. Generate Password
- Use the built-in generator with customizable options
- Adjust length (8-64 characters)
- Toggle character types (uppercase, lowercase, numbers, symbols)
- Option to exclude similar-looking characters (0, O, 1, l, I, |)
- Instant generation with strength indicator

### 3. Save to Vault
- Add title, username, password, URL, and notes
- All data is encrypted client-side before saving
- Server only stores encrypted blobs

### 4. Manage Entries
- Search across all vault items
- Copy passwords/usernames to clipboard (auto-clear after 15s)
- Edit or delete entries
- Toggle password visibility

## 🔒 Security Architecture

```
User Password → PBKDF2 (10k iterations) → Encryption Key
                                            ↓
Vault Data → AES-256 Encryption → Encrypted Blob → Server Storage
```

### Data Flow
1. User enters master password during login
2. PBKDF2 derives encryption key from master password + salt
3. Vault items are encrypted client-side using derived key
4. Server stores only encrypted data and authentication tokens
5. Data is decrypted client-side when retrieved

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/password-vault
NEXTAUTH_SECRET=generate-a-secure-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
JWT_SECRET=generate-a-secure-jwt-secret
ENCRYPTION_KEY=generate-a-32-character-key
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Vault Management
- `GET /api/vault` - Get all vault items (encrypted)
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/[id]` - Update vault item
- `DELETE /api/vault/[id]` - Delete vault item

## 🧪 Testing

Run the development server and test the following flow:

1. **Registration**: Create a new account
2. **Password Generation**: Generate a strong password
3. **Save Entry**: Add the generated password to your vault
4. **Search**: Search for the saved entry
5. **Copy**: Copy password to clipboard
6. **Edit**: Modify the entry
7. **Delete**: Remove the entry
8. **Database Verification**: Check that only encrypted data is stored
