# Playwright Framework for Sauce Demo

## Introduction

This is a comprehensive Playwright TypeScript framework designed for end-to-end testing of the Sauce Demo website. Playwright is a modern web testing framework developed by Microsoft that enables reliable, fast, and scalable testing across all major browsers (Chromium, Firefox, and WebKit) with a single API.

### What is Playwright?

Playwright is an open-source automation library for web browsers that provides:
- **Cross-browser support**: Test on Chromium, Firefox, and WebKit with the same API
- **Headless and headed modes**: Run tests in headless mode for CI/CD or headed for debugging
- **Auto-waiting**: Intelligent waiting for elements to be ready before performing actions
- **Network interception**: Mock network requests and responses
- **Screenshot and video recording**: Capture test execution for debugging
- **Parallel execution**: Run tests in parallel for faster execution
- **Mobile emulation**: Test responsive designs with device emulation

### Framework Purpose

This framework demonstrates best practices for:
- **Page Object Model (POM)**: Organized, maintainable test code
- **TypeScript**: Type-safe test development
- **Test automation**: Reliable end-to-end testing of web applications
- **CI/CD integration**: Ready for continuous integration pipelines
- **Code quality**: Linting and formatting standards

## Features

- **Page Object Model (POM)**: Organized page classes for better maintainability and reusability
- **TypeScript**: Type-safe test scripts with IntelliSense support
- **Prettier**: Automated code formatting for consistent style
- **ESLint**: Static code analysis with TypeScript and Playwright-specific rules
- **Parallel Test Execution**: Configurable parallelization for faster test runs
- **Cross-browser Testing**: Support for multiple browser configurations
- **Global Setup/Teardown**: Centralized test environment management
- **Test Fixtures**: Reusable test setup and page object instances
- **Comprehensive Reporting**: HTML reports with screenshots and traces
- **CI/CD Ready**: Optimized for continuous integration environments

## Prerequisites and System Requirements

### System Requirements

- **Operating System**: macOS, Linux, or Windows
- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: For version control and cloning repositories
- **RAM**: Minimum 4GB, recommended 8GB+
- **Disk Space**: At least 2GB free space for dependencies and browser binaries

### Browser Requirements

Playwright automatically installs browser binaries during setup:
- Chromium (latest stable)
- Firefox (latest stable)
- WebKit (Safari engine)

### Development Environment

- **VS Code**: Recommended IDE with TypeScript and Playwright extensions
- **Git**: Version control system
- **Terminal/Command Prompt**: For running commands

## Project Structure

```
Playwright-Framework/
├── tests/                          # Main test directory
│   ├── pages/                      # Page Object Model classes
│   │   ├── login-page.ts          # Login page interactions
│   │   ├── products-page.ts       # Products page interactions
│   │   └── mini-cart.ts           # Shopping cart interactions
│   ├── specs/                      # Test specification files
│   │   ├── login-tests.spec.ts    # Login functionality tests
│   │   └── cart-tests.spec.ts     # Shopping cart tests
│   ├── testdata/                   # Test data and constants
│   │   └── sauce-demo-test-data.ts # User credentials and test data
│   └── fixtures/                   # Test fixtures and setup
│       └── testFixtures.ts         # Page object fixtures
├── test-setup/                     # Global test configuration
│   ├── global-setup.ts             # Pre-test setup (authentication, etc.)
│   ├── global-teardown.ts          # Post-test cleanup
│   └── page-setup.ts               # Page-level setup utilities
├── playwright-report/              # Generated test reports
├── test-results/                   # Test execution results
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── .prettierrc                     # Prettier formatting rules
├── eslint.config.js                # ESLint configuration
├── package.json                    # Project dependencies and scripts
├── package-lock.json               # Dependency lock file
└── README.md                       # This documentation file
```

### Directory Explanations

- **`tests/pages/`**: Contains Page Object Model classes that encapsulate page-specific logic, selectors, and actions. Each class represents a page or component in the application under test.

- **`tests/specs/`**: Test specification files containing the actual test cases. Tests are organized by feature and use descriptive naming conventions.

- **`tests/testdata/`**: Centralized test data including user credentials, test inputs, and expected results. Helps maintain test data separately from test logic.

- **`tests/fixtures/`**: Playwright test fixtures that provide reusable setup code and page object instances to tests.

- **`test-setup/`**: Global setup and teardown scripts that run before and after the entire test suite, typically for authentication setup or environment preparation.

- **`playwright-report/`**: Auto-generated HTML reports with test results, screenshots, and traces for failed tests.

- **`test-results/`**: Raw test execution data and artifacts.

## Installation Guide

### Step-by-Step Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/qanitabokhari1/Playwright-Automation-Framework.git
   cd Playwright-Automation-Framework
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```
   This installs all project dependencies including Playwright, TypeScript, ESLint, and Prettier.

3. **Install Playwright Browsers**:
   ```bash
   npx playwright install
   ```
   Downloads browser binaries for Chromium, Firefox, and WebKit.

4. **Verify Installation**:
   ```bash
   npm run build
   ```
   Compiles TypeScript to check for any compilation errors.

5. **Run Code Quality Checks**:
   ```bash
   npm run lint
   npm run format
   ```
   Ensures code follows linting rules and formatting standards.

### Post-Installation Verification

- **Check Node.js and npm versions**:
  ```bash
  node --version
  npm --version
  ```

- **Verify Playwright installation**:
  ```bash
  npx playwright --version
  ```

- **Run a quick test**:
  ```bash
  npm run test:smoke
  ```

## Configuration Explanations

### playwright.config.ts

The Playwright configuration file defines test execution settings:

```typescript
export default defineConfig({
  testDir: './tests',              // Location of test files
  fullyParallel: false,            // Run tests in parallel
  forbidOnly: !!process.env.CI,    // Prevent .only in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests
  workers: process.env.CI ? 3 : 6, // Number of parallel workers

  globalSetup: require.resolve('./test-setup/global-setup'),
  globalTeardown: require.resolve('./test-setup/global-teardown'),

  use: {
    headless: true,                // Run browsers in headless mode
    baseURL: BASE_URL,             // Base URL for tests
    trace: 'retain-on-failure',    // Capture traces on failure
    screenshot: 'only-on-failure', // Capture screenshots on failure
  },

  projects: [
    {
      name: 'setup',               // Authentication setup project
      testMatch: '**/storage-setup.ts',
    },
    {
      name: 'chromium',            // Headed Chromium tests
      dependencies: ['setup'],
    },
    {
      name: 'chromiumheadless',    // Headless Chromium tests
      dependencies: ['setup'],
    },
  ],
});
```

**Key Configurations**:
- **Projects**: Define different test environments (setup, headed, headless)
- **Dependencies**: Setup project runs before main tests for authentication
- **Timeouts**: Configurable action, navigation, and test timeouts
- **Base URL**: Default URL for all tests
- **Artifacts**: Screenshots, traces, and videos for debugging

### tsconfig.json

TypeScript configuration with path aliases for cleaner imports:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "module": "commonjs",
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["tests/pages/*"],
      "@specs/*": ["tests/specs/*"],
      "@testdata/*": ["tests/testdata/*"],
      "@fixturesetup": ["tests/fixtures/testFixtures"],
      "@pagesetup": ["test-setup/page-setup"]
    }
  },
  "include": ["tests/**/*.ts", "test-setup/**/*.ts", "playwright.config.ts"]
}
```

**Key Features**:
- **Path Aliases**: Shorten import paths (e.g., `@pages/login-page`)
- **Strict Mode**: Enhanced type checking
- **DOM Types**: Browser API type definitions
- **ES2020 Target**: Modern JavaScript features

### eslint.config.js

ESLint configuration with TypeScript, Playwright, and import rules:

```javascript
module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: { project: './tsconfig.json' },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
      import: importPlugin,
      jsdoc: jsdoc,
      playwright: playwright,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'playwright/missing-playwright-await': ['error'],
      'playwright/no-focused-test': 'error',
      // ... additional rules
    },
  },
];
```

**Key Rules**:
- **Prettier Integration**: Formatting errors as ESLint errors
- **TypeScript Rules**: Type safety and code quality
- **Playwright Rules**: Playwright-specific best practices
- **Import Rules**: Proper import/export handling

### .prettierrc

Code formatting configuration:

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "auto"
}
```

**Key Settings**:
- **Semi**: Require semicolons
- **Single Quote**: Use single quotes for strings
- **Print Width**: Maximum line length
- **Trailing Comma**: Add commas after last elements

## Page Object Model (POM) Explanation

The Page Object Model is a design pattern that creates an object repository for web UI elements. Each page or component has a corresponding class that encapsulates:

- **Selectors**: CSS selectors, XPath expressions
- **Actions**: Click, fill, navigate methods
- **Assertions**: Verification methods
- **Business Logic**: Page-specific workflows

### Example: LoginPage Class

```typescript
export class LoginPage {
  private readonly userName = '#user-name';
  private readonly password = () => getLocator('#password');
  private readonly loginButton = () => getLocatorByRole('button', { name: 'Login' });

  public async navigateToSauceDemoLoginPage(): Promise<void> {
    await gotoURL('https://www.saucedemo.com/');
  }

  public async loginWithValidCredentials(credentials: User): Promise<void> {
    await fill(this.userName, credentials.username);
    await fill(this.password(), credentials.password);
    await clickAndNavigate(this.loginButton());
    await this.verifyUserIsLoggedin();
  }

  public async verifyUserIsLoggedin(): Promise<void> {
    await expectElementToBeAttached(this.logoutLink, 'User should be Logged in successfully');
  }
}
```

### Benefits of POM

1. **Maintainability**: UI changes only require updates in one place
2. **Reusability**: Page methods can be used across multiple tests
3. **Readability**: Test code focuses on business logic, not selectors
4. **Type Safety**: TypeScript ensures correct method calls
5. **Abstraction**: Hides implementation details from tests

### Page Classes in This Framework

- **LoginPage**: Handles login functionality and authentication
- **ProductsPage**: Manages product listing and selection
- **MiniCart**: Handles shopping cart interactions

## Test Data and Fixtures Explanation

### Test Data Structure

Test data is centralized in `tests/testdata/` for easy maintenance:

```typescript
export interface User {
  username: string;
  password: string;
}

export const standardUserCredentials: User = {
  username: 'standard_user',
  password: 'secret_sauce',
};

export const invalidUserCredentials: User = {
  username: 'invalid_user',
  password: 'invalid_password',
};
```

### Test Fixtures

Fixtures provide reusable setup code and page object instances:

```typescript
export const test = baseTest.extend<{
  loginPage: LoginPage;
  productsPage: ProductsPage;
  miniCartPage: MiniCart;
}>({
  loginPage: async ({ page: _page }, use) => {
    await use(new LoginPage());
  },
  // ... other fixtures
});
```

**Benefits**:
- **Dependency Injection**: Page objects automatically available in tests
- **Setup/Teardown**: Automatic cleanup after each test
- **Type Safety**: TypeScript ensures correct fixture usage

## Global Setup and Teardown Details

### Global Setup (global-setup.ts)

Runs once before all tests in the suite:

```typescript
async function globalSetup() {
  // Authentication setup
  // Database initialization
  // Test data preparation
  // Environment configuration
}

export default globalSetup;
```

### Global Teardown (global-teardown.ts)

Runs once after all tests complete:

```typescript
async function globalTeardown() {
  // Cleanup test data
  // Close database connections
  // Generate reports
  // Environment cleanup
}

export default globalTeardown;
```

### Use Cases

- **Authentication**: Set up login sessions or API tokens
- **Database**: Initialize test databases or seed data
- **Environment**: Configure test environments
- **Cleanup**: Remove test artifacts and reset state

## Running Tests

### Available npm Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm test` | `playwright test` | Run all tests |
| `npm run test:chromium` | `playwright test --retries 0 --project=chromiumheadless` | Run tests in headless Chromium |
| `npm run test:chromium-headed` | `playwright test -j 1 --retries 0 --headed --project=chromium` | Run tests in headed mode (1 worker) |
| `npm run local` | `playwright test -j 1 --retries 0 --headed --project=chromium` | Local development testing |
| `npm run test:smoke` | `playwright test --project=chromiumheadless -g '@smoke'` | Run smoke tests only |
| `npm run report` | `playwright show-report playwright-report` | View test report |

### Command-Line Options

- **`--project <name>`**: Specify browser project (chromium, chromiumheadless)
- **`--headed`**: Run tests in headed mode (visible browser)
- **`--debug`**: Run tests in debug mode with Playwright Inspector
- **`--grep <pattern>`**: Run tests matching pattern
- **`--retries <number>`**: Number of retry attempts for failed tests
- **`--workers <number>`**: Number of parallel workers
- **`--timeout <ms>`**: Test timeout in milliseconds

### Examples

```bash
# Run specific test file
npm test -- tests/specs/login-tests.spec.ts

# Run tests with specific tag
npm test -- --grep "@smoke"

# Debug a specific test
npm run test:chromium-headed -- --debug --grep "login"

# Run tests in specific project
npm test -- --project=chromium
```

## Code Quality

### Linting

ESLint checks for code quality issues:

```bash
# Check for linting issues
npm run lint

# Fix auto-fixable linting issues
npm run lint:fix
```

**Linting Rules Include**:
- TypeScript strict type checking
- Playwright best practices
- Import/export consistency
- Code complexity limits
- JSDoc documentation requirements

### Formatting

Prettier ensures consistent code formatting:

```bash
# Format all code files
npm run format
```

**Formatting Standards**:
- 2-space indentation
- Single quotes for strings
- Semicolons required
- 120 character line width
- Trailing commas

### TypeScript Compilation

```bash
# Check TypeScript compilation
npm run build
```

## Test Cases

### Login Tests (@smoke)

**Test File**: `tests/specs/login-tests.spec.ts`

1. **Successful login displays Products Page**
   - Navigate to Sauce Demo login page
   - Enter valid credentials
   - Verify successful login and products page display

2. **Invalid login shows error message**
   - Navigate to Sauce Demo login page
   - Enter invalid credentials
   - Verify error message display and login page remains visible

### Cart Tests (@smoke)

**Test File**: `tests/specs/cart-tests.spec.ts`

1. **Add product to cart updates mini cart count**
   - Login with valid credentials
   - Navigate to products page
   - Add a product to cart
   - Verify cart count updates to "1"

### Test Structure

```typescript
test.describe('Sauce Demo Login Tests @smoke', () => {
  test.beforeEach('Setup', async ({ loginPage }) => {
    await loginPage.navigateToSauceDemoLoginPage();
  });

  test('Test case description', async ({ pageObjects }) => {
    // Test steps
    // Assertions
  });
});
```

## Dependencies Explanation

### Core Dependencies (package.json)

- **`@playwright/test`**: Main Playwright testing framework
- **`typescript`**: TypeScript compiler and language support
- **`@types/node`**: Node.js type definitions

### Development Dependencies

- **ESLint & Plugins**:
  - `@eslint/js`: ESLint core
  - `@typescript-eslint/eslint-plugin`: TypeScript-specific rules
  - `@typescript-eslint/parser`: TypeScript parser for ESLint
  - `eslint-plugin-import`: Import/export validation
  - `eslint-plugin-jsdoc`: JSDoc documentation rules
  - `eslint-plugin-playwright`: Playwright-specific linting

- **Prettier**:
  - `prettier`: Code formatter
  - `eslint-plugin-prettier`: Prettier-ESLint integration

- **Type Definitions**:
  - `@types/node`: Node.js types

- **Utilities**:
  - `vasu-playwright-utils`: Custom Playwright utilities
  - `dotenv`: Environment variable management

### Dependency Management

```bash
# Install dependencies
npm install

# Update dependencies
npm update

# Audit dependencies for security
npm audit

# Fix security issues
npm audit fix
```

## Troubleshooting and Best Practices

### Common Issues

1. **Browser Installation Failed**
   ```bash
   npx playwright install --force
   ```

2. **Tests Timeout**
   - Increase timeout in playwright.config.ts
   - Check network connectivity
   - Verify application under test is accessible

3. **Element Not Found**
   - Verify selectors are correct
   - Check if elements load dynamically
   - Use `await page.waitForSelector()` if needed

4. **Flaky Tests**
   - Add proper waits using auto-waiting
   - Use more specific selectors
   - Implement retry logic for unstable elements

### Best Practices

1. **Selector Strategy**
   - Prefer data-testid attributes
   - Use semantic selectors (roles, labels)
   - Avoid brittle XPath expressions

2. **Test Organization**
   - Keep tests focused and atomic
   - Use descriptive test names
   - Group related tests in describe blocks

3. **Page Objects**
   - Keep page objects thin and focused
   - Use meaningful method names
   - Include assertions in page methods

4. **Configuration**
   - Use environment variables for sensitive data
   - Configure different settings for CI/local
   - Keep timeouts reasonable but sufficient

5. **CI/CD Integration**
   - Use headless mode in CI
   - Configure appropriate parallelization
   - Set up proper artifact collection

### Debugging Tips

- Use `await page.pause()` for interactive debugging
- Enable traces: `trace: 'on'` in config
- Use Playwright Inspector: `npm run test:chromium-headed -- --debug`
- Check browser console logs for JavaScript errors

## Contributing Guidelines

### Development Workflow

1. **Fork and Clone**
   ```bash
   git clone <your-fork-url>
   cd Playwright-Framework
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Make Changes**
   - Follow existing code patterns
   - Add/update tests for new functionality
   - Ensure code quality checks pass

5. **Run Quality Checks**
   ```bash
   npm run lint
   npm run format
   npm run build
   npm test
   ```

6. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

7. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Imports**: Group imports (external, internal, types)
- **Documentation**: JSDoc comments for public methods
- **Testing**: 100% test coverage for new features

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types**: feat, fix, docs, style, refactor, test, chore

### Pull Request Process

1. Ensure all checks pass (CI, linting, tests)
2. Provide clear description of changes
3. Include screenshots for UI changes
4. Request review from maintainers
5. Address review feedback
6. Merge after approval

### Reporting Issues

- Use GitHub Issues for bugs and feature requests
- Provide detailed reproduction steps
- Include environment information
- Attach screenshots/logs for visual issues

---

## Quick Start

```bash
# Install dependencies
npm install

# Install browsers
npx playwright install

# Run tests
npm test

# View report
npm run report
```

For more information, see the [Playwright Documentation](https://playwright.dev/).
