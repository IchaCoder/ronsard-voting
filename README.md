# Ronsard Voting System

A modern, secure voting platform built for Ecole Ronsard student council elections. This system provides a streamlined voting experience with PIN-based authentication and real-time results tracking.

## 🚀 Features

### Authentication & Security

- **PIN-based Authentication**: Secure login using unique PINs distributed by IT
- **Single Vote Protection**: Prevents multiple votes from the same user
- **Session Management**: Secure session handling with Supabase authentication

### Voting System

- **Multiple Voting Types**:
  - Traditional candidate selection for competitive positions
  - Yes/No voting for single-candidate positions
- **Real-time Vote Tracking**: Live vote counts and percentages
- **Portfolio-based Organization**: Votes organized by student council positions
- **Vote Confirmation**: Double confirmation before vote submission

### Administration

- **Candidate Management**: Add, edit, and manage candidates with profile images
- **Image Upload**: Automatic image upload and optimization
- **Results Dashboard**: Comprehensive results display with analytics
- **Vote Scheduling**: Configurable voting start and end times

### User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Interface**: Clean, modern UI built with shadcn/ui components
- **Progress Tracking**: Visual progress indicators and voting status
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Tech Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation

### Backend & Database

- **Supabase**: Backend-as-a-Service platform
- **PostgreSQL**: Relational database
- **Row Level Security**: Database-level security policies
- **Real-time Subscriptions**: Live data updates

### File Management

- **Supabase Storage**: Image upload and management
- **Automatic Optimization**: Image processing and optimization

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ronsard-voting
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXT_PUBLIC_SUPABASE_THUMBNAIL_BUCKET=candidate-images
   ```

4. **Database Setup**
   Run the following SQL commands in your Supabase SQL editor:

   ```sql
   -- Create candidates table
   CREATE TABLE candidates (
     id SERIAL PRIMARY KEY,
     first_name VARCHAR(100) NOT NULL,
     middle_name VARCHAR(100),
     last_name VARCHAR(100) NOT NULL,
     portfolio VARCHAR(100) NOT NULL,
     image TEXT,
     votes INTEGER DEFAULT 0,
     yes_votes INTEGER DEFAULT 0,
     no_votes INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create users table
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     pin VARCHAR(20) UNIQUE NOT NULL,
     has_voted BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create votes table (optional, for audit trail)
   CREATE TABLE votes (
     id SERIAL PRIMARY KEY,
     user_pin VARCHAR(20) REFERENCES users(pin),
     candidate_id INTEGER REFERENCES candidates(id),
     portfolio VARCHAR(100),
     vote_type VARCHAR(10), -- 'candidate', 'yes', 'no'
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Storage Setup**
   Create a storage bucket named `candidate-images` in your Supabase dashboard.

6. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
ronsard-voting/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server actions
│   │   ├── candidate/
│   │   │   └── add.ts           # Add candidate functionality
│   │   └── upload.ts            # File upload utilities
│   ├── results/                 # Results page
│   ├── vote/                    # Voting page
│   └── layout.tsx               # Root layout
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── candidate-management.tsx # Admin candidate management
│   ├── login-form.tsx          # PIN authentication form
│   ├── results-display.tsx     # Results visualization
│   └── voting-interface.tsx    # Main voting interface
├── utils/                       # Utility functions
│   ├── supabase/               # Supabase client configuration
│   ├── types.ts                # TypeScript type definitions
│   └── enums.ts                # Enum definitions
└── public/                     # Static assets
```

## 🎯 Usage

### For Voters

1. **Login**: Enter your unique PIN provided by IT
2. **Vote**: Select candidates for each portfolio position
3. **Confirm**: Review and confirm your selections
4. **Complete**: Submit your vote (one-time only)

### For Administrators

1. **Manage Candidates**: Add candidates with photos and portfolio assignments
2. **Monitor Voting**: Track real-time voting progress
3. **View Results**: Access comprehensive results dashboard
4. **Configure Schedule**: Set voting start and end times

## ⚙️ Configuration

### Voting Schedule

Update voting times in `components/voting-interface.tsx`:

```typescript
const VOTING_CONFIG = {
  startTime: new Date("2025-05-28T08:00:00"), // Voting start
  endTime: new Date("2025-05-28T14:45:00"), // Voting end
};
```

### Portfolio Categories

Modify available positions in `utils/enums.ts`:

```typescript
export const Categories = {
  school_head: "School Head",
  deputy_head: "Deputy Head",
  treasurer: "Treasurer",
  // Add more positions as needed
};
```

## 🔐 Security Features

- **PIN-based Authentication**: Unique PINs for each voter
- **Vote Integrity**: One vote per PIN enforcement
- **Data Validation**: Client and server-side validation
- **Secure Storage**: Encrypted data storage with Supabase
- **CSRF Protection**: Built-in Next.js security features

## 📊 Analytics & Reporting

- **Real-time Results**: Live vote counting and percentages
- **Portfolio Breakdown**: Results organized by position
- **Visual Charts**: Progress bars and result visualization
- **Export Capabilities**: Results can be exported for official records

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For technical support or questions:

- Create an issue in the repository
- Contact the IT department at Ecole Ronsard
- Email: [support@ecoleronsard.edu](mailto:support@ecoleronsard.edu)

## 🔄 Version History

- **v1.0.0**: Initial release with basic voting functionality
- **v1.1.0**: Added yes/no voting for single candidates
- **v1.2.0**: Enhanced results dashboard and analytics

---

Built with ❤️ for Ecole Ronsard Student Council Elections
