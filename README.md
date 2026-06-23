# KFUPM Conference Website

A modern, interactive website for a KFUPM-managed student conference. Built with React and TypeScript, this project provides registration, information, and an intuitive user experience for conference attendees.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Running the Project](#running-the-project)
- [Available Scripts](#available-scripts)

## 🎯 Project Overview

This is a full-featured conference website that enables KFUPM students and attendees to:
- Register for the conference
- View conference information and schedule
- Access event details and speaker information
- Navigate with an intuitive, modern interface

The project is built as a component-based architecture using shadcn/ui components, ensuring consistency, maintainability, and reusability across the application.

## 🛠️ Tech Stack

### Core Framework
- **React** - UI library for building interactive components
- **TypeScript** - Type-safe JavaScript for better code quality and developer experience
- **Vite** - Lightning-fast build tool and development server

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, reusable React components built on Radix UI
- **Radix UI** - Unstyled, accessible components library (foundation for shadcn/ui)

### Additional Libraries
- **React Router** - Client-side routing for navigation
- **React Hook Form** - Efficient form management with validation
- **Motion** - Animation and motion library
- **date-fns** - Date manipulation and formatting
- **lucide-react** - Beautiful icon library
- **Canvas Confetti** - Celebratory animations

### Development Tools
- **Tailwind CSS Vite** - Vite plugin for Tailwind CSS

## 📦 Installation & Setup

### Prerequisites

Before you start, make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v8 or higher) - Package manager used in this project
  - Install with: `npm install -g pnpm`
  - Or using other methods: [pnpm installation guide](https://pnpm.io/installation)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SRC
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```
   
   This command will:
   - Read the `package.json` and `pnpm-workspace.yaml` files
   - Download and install all required packages
   - Set up the project workspace

3. **Verify installation**
   ```bash
   pnpm -v  # Check pnpm version
   node -v  # Check Node.js version
   ```

### Troubleshooting Installation

- **`pnpm not found`**: Make sure pnpm is installed globally (`npm install -g pnpm`)
- **Port already in use**: If port 5173 is occupied, Vite will automatically use the next available port
- **Module not found errors**: Try deleting `node_modules` folder and `pnpm-lock.yaml`, then run `pnpm install` again

## 📁 Project Structure

```
SRC/
├── src/                              # Source code
│   ├── main.tsx                      # Application entry point
│   ├── app/
│   │   ├── App.tsx                   # Root application component
│   │   └── components/
│   │       ├── figma/                # Figma-specific components
│   │       │   └── ImageWithFallback.tsx
│   │       └── ui/                   # Reusable UI components (shadcn)
│   │           ├── accordion.tsx
│   │           ├── button.tsx
│   │           ├── card.tsx
│   │           ├── dialog.tsx
│   │           ├── form.tsx
│   │           ├── sidebar.tsx
│   │           ├── tabs.tsx
│   │           └── ... (40+ other UI components)
│   ├── styles/                       # Global styles
│   │   ├── globals.css               # Global CSS resets and base styles
│   │   ├── tailwind.css              # Tailwind configuration imports
│   │   ├── theme.css                 # Theme variables and customization
│   │   └── fonts.css                 # Font definitions
│   ├── imports/                      # Shared imports/utilities
│   └── vite-env.d.ts                 # Vite environment type definitions
├── guidelines/
│   └── Guidelines.md                 # Development guidelines
├── public/                           # Static assets
├── index.html                        # HTML entry point
├── package.json                      # Project dependencies
├── pnpm-workspace.yaml               # pnpm workspace configuration
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite configuration
├── postcss.config.mjs                # PostCSS configuration (for Tailwind)
├── tailwind.config.js                # Tailwind CSS configuration
├── default_shadcn_theme.css          # Default shadcn theme
└── README.md                         # This file
```

### Key Directories Explained

- **`src/app/components/ui/`** - Contains all reusable UI components from shadcn/ui. These are pre-built, styled components you can use throughout the project
- **`src/styles/`** - Contains all CSS files. `theme.css` is where you customize colors and themes
- **`src/app/`** - Main application components and page components
- **`guidelines/`** - Contains development guidelines and best practices for this project

## 🚀 Running the Project

### Development Server

Start the development server with hot module replacement (HMR) enabled:

```bash
pnpm dev
```

What this does:
- Starts a local development server (usually on `http://localhost:5173`)
- Enables hot module replacement - your changes appear instantly without full page reload
- Opens the browser automatically (usually)
- Shows errors in the terminal and sometimes in the browser

**Output you should see:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

#### First Time Setup Tips
- The first startup might be slower as dependencies are being resolved
- If the browser doesn't open automatically, manually navigate to `http://localhost:5173`
- Check the terminal for any errors if something doesn't load

### Production Build

Build the project for production:

```bash
pnpm build
```

What this does:
- Optimizes and minifies your code
- Creates a `dist/` folder with production-ready files
- Performs tree-shaking to remove unused code
- Generates source maps for debugging (optional)

**Output location:** `dist/` folder

## 📝 Available Scripts

These are the commands you can run in your terminal:

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload (use for development) |
| `pnpm build` | Build project for production |
| `pnpm preview` | Preview the production build locally before deploying |

### Example Workflow

```bash
# 1. Start working on features
pnpm dev

# 2. Make your changes (they auto-reload)

# 3. When ready to deploy
pnpm build

# 4. Test production build locally
pnpm preview

# 5. Deploy the contents of the dist/ folder
```

## 🎨 Working with Components

### Using shadcn/ui Components

All UI components are in `src/app/components/ui/`. To use a component:

```tsx
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card'

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  )
}
```

### Customizing Themes

Edit `src/styles/theme.css` to customize colors and other theme variables. These changes will apply globally to all shadcn components.

## 📚 Additional Resources

- **Vite Documentation**: https://vitejs.dev/
- **React Documentation**: https://react.dev/
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui Components**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/

## 👥 Getting Help

If you encounter issues:

1. Check the [Guidelines.md](./guidelines/Guidelines.md) for project-specific guidelines
2. Look at existing components in `src/app/components/` for examples
3. Check the terminal for error messages when running `pnpm dev`
4. Consult the tech stack documentation links above

## 📄 License

See [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) for license and attribution information.

---
