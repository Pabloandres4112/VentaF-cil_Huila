# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: checkout-stock.spec.ts >> checkout — descuento de stock >> la primera compra de la última unidad funciona y la segunda queda bloqueada
- Location: tests\checkout-stock.spec.ts:52:7

# Error details

```
Error: browserType.launch: Executable doesn't exist at C:\Users\LENOVO\AppData\Local\ms-playwright\chromium_headless_shell-1243\chrome-headless-shell-win64\chrome-headless-shell.exe
╔════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.       ║
║ Please run the following command to download new browsers: ║
║                                                            ║
║     pnpm exec playwright install                           ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝
```