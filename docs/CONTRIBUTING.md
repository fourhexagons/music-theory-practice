# Contributing Guide

Thank you for your interest in contributing to the Music Theory Practice App! This guide will help you get started.

## 🤝 How to Contribute

### Types of Contributions
We welcome various types of contributions:
- **Bug fixes** - Report and fix issues
- **New features** - Add functionality
- **Documentation** - Improve guides and docs
- **Testing** - Add or improve tests
- **UI/UX improvements** - Enhance the user experience

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Set up the development environment** (see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md))
4. **Create a feature branch** for your changes

```bash
git clone https://github.com/your-username/music-theory-practice.git
cd music-theory-practice
git checkout -b feature/your-feature-name
```

## 📝 Development Workflow

### Before You Start
- **Check existing issues** to avoid duplicates
- **Discuss major changes** in an issue first
- **Read the existing code** to understand patterns

### Making Changes
1. **Make your changes** following the coding standards
2. **Add tests** for new functionality
3. **Run the test suite** to ensure everything works
4. **Update documentation** if needed

### Testing Your Changes
```bash
# Start the development server
python3 -m http.server 8000

# Open in browser and run tests
# Press Ctrl+Shift+Q (or Cmd+Shift+Q on Mac) to run tests
```

## 🎯 Coding Standards

### JavaScript
- **Use consistent naming** (camelCase for variables/functions)
- **Add comments** for complex logic
- **Follow existing patterns** in the codebase
- **Validate inputs** thoroughly

### CSS
- **Use meaningful class names**
- **Keep styles modular**
- **Follow the existing design system**

### HTML
- **Use semantic elements**
- **Ensure accessibility**
- **Validate markup**

## 🧪 Testing Requirements

### Before Submitting
- **All tests must pass**
- **Add tests for new features**
- **Test on multiple browsers**
- **Test responsive design**

### Running Tests
- **Automatic**: Tests run on page load in development
- **Manual**: Use `Ctrl+Shift+Q` keyboard shortcut
- **Console**: Use `runAllTests()` function

## 📋 Pull Request Process

### Creating a PR
1. **Push your changes** to your fork
2. **Create a pull request** with a clear description
3. **Link related issues** if applicable
4. **Wait for review** from maintainers

### PR Requirements
- **Clear title** describing the change
- **Detailed description** of what was changed and why
- **Screenshots** for UI changes
- **Test results** showing all tests pass

### PR Template
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Test improvement

## Testing
- [ ] All tests pass
- [ ] Tested on multiple browsers
- [ ] Added tests for new functionality

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🐛 Reporting Issues

### Before Reporting
- **Check existing issues** for duplicates
- **Try to reproduce** the issue
- **Check browser console** for errors

### Issue Template
```markdown
## Description
Clear description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g. Chrome, Firefox]
- OS: [e.g. Windows, macOS]
- Version: [e.g. 1.0.0]

## Additional Information
Any other context, screenshots, etc.
```

## 🏷️ Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```
feat(chords): add support for diminished chords
fix(normalization): resolve case sensitivity issues
docs(readme): update installation instructions
test(chords): add comprehensive chord tests
```

## 📚 Resources

- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Development setup guide
- **[docs/TESTING.md](docs/TESTING.md)** - Testing and debugging information
- **GitHub Issues** - Report bugs and request features
- **Discussions** - Ask questions and share ideas

## 🎉 Recognition

Contributors will be recognized in:
- **README.md** contributors section
- **GitHub contributors** page
- **Release notes** for significant contributions

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and general discussion
- **Pull Request comments** - For specific code feedback

---

**Thank you for contributing to making music theory learning more accessible! 🎼**

*This contributing guide is maintained by the development team. For user support, see the main [README.md](../README.md).* 