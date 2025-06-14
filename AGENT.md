# SlidePilot Agent Memory

## Project Overview
SlidePilot is an AI-powered PowerPoint editor built with Tauri that leverages LibreOffice headless as its core presentation engine. The application enables users to create, edit, and enhance PowerPoint presentations through an intuitive AI agent interface.

## Development Commands

### Start Development Server
```bash
bun run tauri dev
```
This command:
- Starts the Tauri application (desktop)
- Also spins up the web version accessible via browser
- Hot reload enabled for both frontend and backend changes

### Build Commands
```bash
bun run build        # Build frontend
bun run tauri build  # Build complete Tauri application
```

### Rust Build Commands
```bash
cd src-tauri && cargo build        # Build Rust backend only
cd src-tauri && cargo check        # Check Rust code without building
```

### Testing Commands
```bash
# Frontend tests (when implemented)
# bun test

# Rust tests (when implemented)
# cd src-tauri && cargo test
```

## Project Structure

### Frontend (React + TypeScript)
- `src/` - React frontend code
- `src/components/` - Reusable React components
  - `src/components/Layout/` - Layout components (MainLayout, Header)
  - `src/components/Presentation/` - Presentation viewer components
  - `src/components/Chat/` - AI chat interface components
- `src/hooks/` - Custom React hooks
- `src/services/` - Business logic and API services
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

### Backend (Rust + Tauri)
- `src-tauri/src/` - Rust backend code
- `src-tauri/src/lib.rs` - Main Tauri application logic
- `src-tauri/src/libreoffice/` - LibreOffice integration module (Milestone 2)
- `src-tauri/Cargo.toml` - Rust dependencies

## Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Rust, Tauri 2.0
- **Presentation Engine**: LibreOffice Headless (Milestone 2)
- **AI Integration**: LLM APIs (Milestone 3)

## Development Milestones

### Milestone 1: Basic UI Foundation ✅ COMPLETED
- PowerPoint file viewer in main panel
- Sidebar AI chat interface (mock functionality)  
- File opening/loading functionality
- Basic navigation between slides
- Responsive layout design

### Milestone 2: LibreOffice Integration (Current)
- Headless LibreOffice process management
- Rust-LibreOffice communication bridge
- Core presentation manipulation APIs
- Replace mock slide parser with real LibreOffice parsing
- Implementation plan: `IMPLEMENTATION.md`

### Milestone 3: AI Agent MVP
- LLM integration
- Tool system for AI agent
- Natural language command processing

## Code Conventions

### React/TypeScript
- Use functional components with hooks
- Follow existing file naming conventions
- Use TypeScript interfaces for props and data structures
- Implement proper error boundaries
- Use custom hooks for complex state logic

### Rust/Tauri
- Follow Rust naming conventions
- Use Tauri commands for frontend-backend communication
- Implement proper error handling with Result types
- Use serde for serialization/deserialization

### File Organization
- Group related components in feature folders
- Keep utility functions in `src/utils/`
- Define types in `src/types/`
- Business logic in `src/services/`

## Important Notes
- Web version available during development for testing UI
- Desktop version is the primary target
- LibreOffice integration will be local (no cloud dependencies)
- AI features will use external APIs but file processing stays local
- Focus on performance and smooth user experience
- Currently displays mock data for uploaded PowerPoint files - real parsing comes in Milestone 2

## Dependencies Management
- Use `bun` for package management
- Frontend dependencies in `package.json`
- Backend dependencies in `src-tauri/Cargo.toml`
- Keep dependencies minimal and well-maintained

## Testing Strategy
- Unit tests for utility functions
- Component testing for React components
- Integration tests for Tauri commands
- E2E testing for complete workflows

## Known Issues
- PowerPoint file upload shows dummy data instead of actual file content (will be fixed in Milestone 2)
- Mock AI responses in chat interface (will be implemented in Milestone 3)
