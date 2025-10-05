# Contributing to Password Generator & Secure Vault MVP

Thanks for your interest in contributing to this secure password management project! 🎉

## Quick Start

1. Fork the [Password-Generator-Secure-Vault-MVP-](https://github.com/Pankaj2k01/Password-Generator-Secure-Vault-MVP-) repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test your changes: `npm run build` and `npm run dev`
5. Commit: `git commit -m 'feat: Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Development Setup

```bash
git clone https://github.com/YOUR-USERNAME/Password-Generator-Secure-Vault-MVP-.git
cd Password-Generator-Secure-Vault-MVP-
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

## Security Guidelines

- **Never commit secrets** - No API keys, passwords, or .env files
- **Test encryption thoroughly** - Ensure all vault data remains encrypted
- **Follow zero-knowledge principles** - Server must never see plaintext
- **Report security issues privately** - Email maintainer directly for vulnerabilities
- **Use secure random generation** - Leverage crypto.getRandomValues() for passwords

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure CI passes
4. Request review from maintainers

## Areas Where We Need Help

- **🔐 Security improvements** - Enhanced encryption methods, security audits
- **🎨 UI/UX enhancements** - Better user interface, accessibility improvements
- **📱 Mobile optimization** - Touch interactions, responsive design fixes
- **🧪 Testing** - Unit tests, integration tests, security tests
- **📖 Documentation** - API docs, setup guides, security explanations
- **🚀 Performance** - Bundle optimization, loading speed improvements

## Questions?

Open an issue at [Password-Generator-Secure-Vault-MVP-](https://github.com/Pankaj2k01/Password-Generator-Secure-Vault-MVP-/issues) or reach out to [@Pankaj2k01](https://github.com/Pankaj2k01)!
