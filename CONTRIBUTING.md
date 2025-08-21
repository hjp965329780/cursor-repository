# 🤝 Contributing to Text Translator Chrome Extension

Thank you for your interest in contributing to our Chrome Extension project! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Issue Guidelines](#issue-guidelines)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm 8.15.0 or higher
- Chrome browser for testing
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cursor-repository.git
   cd cursor-repository
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/cursor-repository.git
   ```

## 🔧 Development Setup

### Install Dependencies

```bash
# Install pnpm if you haven't already
npm install -g pnpm@8.15.0

# Install project dependencies
pnpm install
```

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Clean build files
pnpm clean
```

### Testing the Extension

1. Build the extension: `pnpm build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `apps/chrome-extension/dist` folder
5. Test the extension functionality

## 📝 Code Style

### TypeScript

- Use TypeScript for all new code
- Follow strict type checking
- Use interfaces for object shapes
- Prefer `const` over `let` when possible

### Vue Components

- Use Vue 3 Composition API
- Follow Vue.js style guide
- Use PascalCase for component names
- Use kebab-case for file names

### General

- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused
- Use consistent indentation (2 spaces)

## 🧪 Testing

### Manual Testing

- Test on different websites
- Test with various text lengths
- Test error scenarios
- Test on different Chrome versions

### Automated Testing

- Write unit tests for utility functions
- Test component rendering
- Test API integrations
- Ensure all tests pass before submitting

## 📤 Submitting Changes

### Commit Guidelines

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(translation): add support for multiple languages
fix(popup): resolve positioning issue on small screens
docs(readme): update installation instructions
```

### Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

3. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub
5. Fill out the PR template
6. Request review from maintainers

### Before Submitting

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors
- [ ] Extension builds successfully
- [ ] Manual testing completed

## 🐛 Issue Guidelines

### Bug Reports

- Use the bug report template
- Provide clear reproduction steps
- Include browser version and OS
- Add console errors if any
- Include screenshots if relevant

### Feature Requests

- Use the feature request template
- Explain the problem being solved
- Provide use cases
- Consider alternatives
- Set appropriate priority

## 📚 Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Vue.js Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/)

## 🆘 Getting Help

- Check existing issues and PRs
- Search documentation
- Ask questions in issues
- Join our community discussions

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing! 🎉
