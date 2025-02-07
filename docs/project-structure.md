# Project Structure

```
📦 pinterest-blogger
├── 📂 src                    # Frontend source code (Next.js)
│   ├── 📂 app               # Next.js app router
│   ├── 📂 components        # React components
│   └── 📂 lib               # Frontend utilities
├── 📂 backend               # Backend source code
│   ├── 📂 src              
│   │   ├── 📂 controllers   # Route controllers
│   │   ├── 📂 services      # Business logic
│   │   ├── 📂 utils         # Utility functions
│   │   └── 📂 routes        # Express routes
│   ├── 📄 .env             # Environment variables
│   └── 📄 server.js        # Express server entry
├── 📂 docs                  # Documentation
└── 📄 README.md            # Project overview
```

## Directory Descriptions

### Frontend (src/)
- `app/`: Next.js pages using the App Router
- `components/`: Reusable React components
- `lib/`: Shared utilities and API clients

### Backend (backend/src/)
- `controllers/`: Request handlers for each route
- `services/`: Core business logic (Pinterest scraping, blog generation, etc.)
- `utils/`: Helper functions and utilities
- `routes/`: Express route definitions

## Key Files
- `backend/.env`: API keys and configuration
- `backend/server.js`: Express server configuration
- `README.md`: Project documentation and setup instructions 