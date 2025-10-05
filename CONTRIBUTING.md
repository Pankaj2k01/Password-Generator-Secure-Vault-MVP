# Contributing to Password Vault

Thanks for your interest in contributing! 🎉

## Quick Start

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test` (when available)
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Development Setup

```bash
git clone your-fork-url
cd password-vault
npm install
cp .env.example .env.local
# Configure your environment variables
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Run `npm run lint` before committing
- Add comments for complex logic

## Security

- Never commit secrets or API keys
- Follow secure coding practices
- Test encryption/decryption thoroughly
- Report security issues privately

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure CI passes
4. Request review from maintainers

## Questions?

Open an issue or reach out to the maintainers!