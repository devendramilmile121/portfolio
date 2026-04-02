---
title: "Angular Injection Tokens: Master Dependency Injection with Custom Tokens"
date: "2026-04-02"
summary: "Unlock the full power of Angular's dependency injection system. Learn how to create custom InjectionTokens for configuration, features toggles, and complex dependencies—turning your loosely-coupled architecture into pure gold."
tags: ["Angular", "Dependency Injection", "TypeScript", "Architecture", "Design Patterns", "Advanced"]
---

# Angular Injection Tokens: Master Dependency Injection with Custom Tokens

Dependency injection is one of Angular's most powerful features, yet many developers underutilize it. While injecting services through constructors feels natural, there's a deeper layer that transforms how you architect applications: **Injection Tokens**.

If you've ever wondered how to inject configuration objects, feature flags, or non-class dependencies, wondered how Angular magically provides `DOCUMENT` or `LOCALE_ID` without explicit class definitions, or hit a wall trying to inject primitive values—this guide reveals the elegant solution.

By mastering Injection Tokens, you'll write more flexible, testable, and maintainable code. Your future self will thank you.

## What Are Dependency Injection and Injection Tokens?

Before diving into tokens, let's establish the foundation.

**Dependency Injection** is a design pattern that decouples components from their dependencies. Instead of a component creating what it needs, the Angular injector provides it. This creates loose coupling, easier testing, and flexible architecture.

**Injection Tokens** are the mechanism that makes this magic work. According to the official Angular glossary:

> "A lookup token associated with a dependency provider, for use with the dependency injection system."

Think of it this way: imagine a cafe where customers order meals. The injector is the waiter who knows exactly what each customer wants based on their order (token) and has a recipe (provider) for preparing it.

### The Cafe Metaphor

Let's establish our mental model:

- **Customers** = Components that need dependencies
- **Orders** = Injection tokens
- **Waiter** = Angular's injector
- **Recipes** = Providers that define how to create dependencies
- **Meals** = The actual dependency instances

When a customer (component) orders something, the waiter (injector) checks the order token, looks up the recipe (provider), prepares the meal (instantiates the dependency), and serves it.

## Why Do We Need Injection Tokens?

### The Problem with Class-Only Dependencies

In many cases, class tokens work perfectly:

```typescript
constructor(private coffeeService: CoffeeService) {}
```

The `CoffeeService` class serves as both the token and the provider. Simple, elegant.

But what happens when you need to inject something that isn't a class?

```typescript
// ❌ What token do we use for a string?
constructor(private appName: string) {}

// ❌ How do we differentiate between multiple strings?
constructor(private appName: string, private version: string) {}

// ❌ What about configuration objects?
constructor(private config: { apiUrl: string; timeout: number }) {}
```

This is where **Injection Tokens** solve the problem. They provide explicit, semantic tokens for any type of dependency.

## Key Concepts Explained

### 1. Understanding the Injector Hierarchy

Angular's dependency injection system operates in a hierarchy. Each component has its own injector context, creating a tree structure from root to leaf components.

```
Root Injector (Application Level)
├── Module A Injector
│   ├── Component 1
│   └── Component 2
├── Module B Injector
│   └── Component 3
└── Lazy Loaded Module Injector
    └── Component 4
```

When a component requests a dependency, Angular searches up the injector hierarchy:
1. Check the component's own providers
2. Check the parent component's providers
3. Continue up to module providers
4. Reach the root injector

This hierarchical approach enables powerful patterns like feature-specific configurations and scope-limited overrides.

### 2. Class Tokens vs. Injection Tokens

**Class Tokens** use the class itself as the token:

```typescript
providers: [CoffeeService]

// Equivalent to:
providers: [{ provide: CoffeeService, useClass: CoffeeService }]

// Inject with:
constructor(private coffee: CoffeeService) {}
```

**Injection Tokens** are explicit token objects created for any dependency:

```typescript
const COFFEE_SERVICE = new InjectionToken<CoffeeService>('coffee-service');

providers: [{ provide: COFFEE_SERVICE, useClass: CoffeeService }]

// Inject with:
constructor(@Inject(COFFEE_SERVICE) private coffee: CoffeeService) {}
```

### 3. Types of Injection Tokens

Angular provides `InjectionToken` for creating custom tokens, but also supports different provider strategies:

- **useClass** - Provide an instance of the specified class
- **useValue** - Provide a constant value
- **useFactory** - Provide using a factory function
- **useExisting** - Use an existing token (aliasing)

## Getting Started with Injection Tokens

### Basic Syntax

Create an injection token with `InjectionToken`:

```typescript
import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('api-url');
```

Provide it:

```typescript
providers: [
  { provide: API_URL, useValue: 'https://api.example.com' }
]
```

Inject it:

```typescript
import { Inject } from '@angular/core';

constructor(@Inject(API_URL) private apiUrl: string) {}
```

That's it! You've mastered the basics. Now let's explore practical applications.

## Building a Real-World Application Configuration System

Let's build a comprehensive example: a multi-tenant SaaS dashboard with environment-specific configuration, feature toggles, and dynamic API endpoints—all managed through Injection Tokens.

> 💻 **[Complete Working Example on GitHub](https://github.com/devendramilmile121/angular-injection-tokens-demo)** - Clone and run the full application with all the code from this tutorial!

### Step 1: Define Your Configuration Tokens

Create a configuration module that defines all your application tokens:

```typescript
// src/app/config/app-config.token.ts
import { InjectionToken } from '@angular/core';

/**
 * Application-wide configuration tokens
 */

export interface AppConfig {
  appName: string;
  appVersion: string;
  apiUrl: string;
  apiTimeout: number;
  enableLogging: boolean;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app-config');

export interface FeatureFlags {
  enableAnalytics: boolean;
  enableDarkMode: boolean;
  enableBeta: boolean;
  enableExportCSV: boolean;
  enableAdvancedSearch: boolean;
}

export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('feature-flags');

export interface TenantConfig {
  tenantId: string;
  tenantName: string;
  brandColor: string;
  logo: string;
  customDomain?: string;
}

export const TENANT_CONFIG = new InjectionToken<TenantConfig>('tenant-config');

export const API_INTERCEPTOR_CONFIG = new InjectionToken<{
  retryAttempts: number;
  retryDelay: number;
}>('api-interceptor-config');

export const CACHE_CONFIG = new InjectionToken<{
  enabled: boolean;
  ttl: number;
  maxSize: number;
}>('cache-config');
```

### Step 2: Create Environment-Specific Configurations

Define different configurations for development, staging, and production:

```typescript
// src/app/config/app-config.dev.ts
import { AppConfig, FeatureFlags, TenantConfig } from './app-config.token';

export const DEV_CONFIG: AppConfig = {
  appName: 'Dashboard Pro',
  appVersion: '1.0.0-dev',
  apiUrl: 'http://localhost:3000/api',
  apiTimeout: 30000,
  enableLogging: true,
};

export const DEV_FEATURES: FeatureFlags = {
  enableAnalytics: true,
  enableDarkMode: true,
  enableBeta: true,
  enableExportCSV: true,
  enableAdvancedSearch: true,
};

export const DEV_TENANT: TenantConfig = {
  tenantId: 'dev-tenant-001',
  tenantName: 'Development Tenant',
  brandColor: '#667eea',
  logo: '/assets/logo-dev.png',
  customDomain: 'dev.example.com',
};
```

```typescript
// src/app/config/app-config.prod.ts
import { AppConfig, FeatureFlags, TenantConfig } from './app-config.token';

export const PROD_CONFIG: AppConfig = {
  appName: 'Dashboard Pro',
  appVersion: '1.0.0',
  apiUrl: 'https://api.example.com',
  apiTimeout: 15000,
  enableLogging: false,
};

export const PROD_FEATURES: FeatureFlags = {
  enableAnalytics: true,
  enableDarkMode: true,
  enableBeta: false,
  enableExportCSV: true,
  enableAdvancedSearch: false,
};

export const PROD_TENANT: TenantConfig = {
  tenantId: 'prod-tenant-001',
  tenantName: 'Production Tenant',
  brandColor: '#667eea',
  logo: '/assets/logo-prod.png',
};
```

### Step 3: Create a Configuration Service

Build a service that manages token injection and provides configuration state:

```typescript
// src/app/config/app-config.service.ts
import { Injectable, signal, Inject } from '@angular/core';
import {
  APP_CONFIG,
  FEATURE_FLAGS,
  TENANT_CONFIG,
  AppConfig,
  FeatureFlags,
  TenantConfig,
} from './app-config.token';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  // Make configurations reactive using signals
  private appConfig = signal<AppConfig | null>(null);
  private featureFlags = signal<FeatureFlags | null>(null);
  private tenantConfig = signal<TenantConfig | null>(null);

  appConfig$ = this.appConfig.asReadonly();
  featureFlags$ = this.featureFlags.asReadonly();
  tenantConfig$ = this.tenantConfig.asReadonly();

  constructor(
    @Inject(APP_CONFIG) appCfg: AppConfig,
    @Inject(FEATURE_FLAGS) flags: FeatureFlags,
    @Inject(TENANT_CONFIG) tenant: TenantConfig
  ) {
    this.appConfig.set(appCfg);
    this.featureFlags.set(flags);
    this.tenantConfig.set(tenant);
  }

  get config(): AppConfig | null {
    return this.appConfig();
  }

  get features(): FeatureFlags | null {
    return this.featureFlags();
  }

  get tenant(): TenantConfig | null {
    return this.tenantConfig();
  }

  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    const flags = this.featureFlags();
    return flags ? flags[feature] : false;
  }

  updateTenantConfig(tenant: Partial<TenantConfig>): void {
    const current = this.tenantConfig();
    if (current) {
      this.tenantConfig.set({ ...current, ...tenant });
    }
  }
}
```

### Step 4: Set Up Application Providers

Configure your application with environment-specific tokens:

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  APP_CONFIG,
  FEATURE_FLAGS,
  TENANT_CONFIG,
  API_INTERCEPTOR_CONFIG,
  CACHE_CONFIG,
} from './config/app-config.token';
import { DEV_CONFIG, DEV_FEATURES, DEV_TENANT } from './config/app-config.dev';
import { PROD_CONFIG, PROD_FEATURES, PROD_TENANT } from './config/app-config.prod';
import { routes } from './app.routes';

// Determine environment
const isProduction = process.env['NG_APP_ENV'] === 'production';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),

    // Inject environment-specific configuration
    {
      provide: APP_CONFIG,
      useValue: isProduction ? PROD_CONFIG : DEV_CONFIG,
    },
    {
      provide: FEATURE_FLAGS,
      useValue: isProduction ? PROD_FEATURES : DEV_FEATURES,
    },
    {
      provide: TENANT_CONFIG,
      useValue: isProduction ? PROD_TENANT : DEV_TENANT,
    },

    // API and caching configuration
    {
      provide: API_INTERCEPTOR_CONFIG,
      useValue: {
        retryAttempts: isProduction ? 3 : 1,
        retryDelay: 1000,
      },
    },
    {
      provide: CACHE_CONFIG,
      useValue: {
        enabled: isProduction,
        ttl: 3600000, // 1 hour
        maxSize: 100,
      },
    },
  ],
};
```

### Step 5: Create Components That Use Configuration

Build components that consume the injected configuration:

```typescript
// src/app/dashboard/dashboard.component.ts
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfigService } from '../config/app-config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container" [style.--brand-color]="brandColor()">
      <header class="dashboard-header">
        <div class="header-content">
          <img [src]="logoUrl()" [alt]="tenantName()" class="logo" />
          <h1>{{ appName() }}</h1>
          <span class="version">v{{ appVersion() }}</span>
        </div>
        <div class="tenant-badge">{{ tenantName() }}</div>
      </header>

      <nav class="feature-toggles">
        <h3>Available Features</h3>
        <div class="feature-list">
          @for (feature of availableFeatures(); track feature.name) {
            <div class="feature-item" [class.disabled]="!feature.enabled">
              <span class="feature-status">
                {{ feature.enabled ? '✓' : '✗' }}
              </span>
              <span>{{ feature.label }}</span>
            </div>
          }
        </div>
      </nav>

      <main class="content-area">
        <section class="config-display">
          <h2>Application Configuration</h2>
          <div class="config-grid">
            <div class="config-item">
              <label>API URL</label>
              <code>{{ apiUrl() }}</code>
            </div>
            <div class="config-item">
              <label>API Timeout</label>
              <code>{{ apiTimeout() }}ms</code>
            </div>
            <div class="config-item">
              <label>Logging</label>
              <code>{{ loggingEnabled() ? 'Enabled' : 'Disabled' }}</code>
            </div>
            <div class="config-item">
              <label>Environment</label>
              <code>{{ environment() }}</code>
            </div>
          </div>
        </section>

        <!-- Conditional Features -->
        @if (isAnalyticsEnabled()) {
          <section class="feature-section">
            <h2>📊 Analytics Dashboard</h2>
            <p>This section only appears when analytics feature is enabled.</p>
          </section>
        }

        @if (isDarkModeEnabled()) {
          <section class="feature-section">
            <h2>🌙 Dark Mode Settings</h2>
            <button (click)="toggleDarkMode()">
              Toggle Dark Mode
            </button>
          </section>
        }

        @if (isExportEnabled()) {
          <section class="feature-section">
            <h2>📥 Export Data</h2>
            <button (click)="exportAsCSV()">
              Export as CSV
            </button>
          </section>
        }

        @if (isAdvancedSearchEnabled()) {
          <section class="feature-section">
            <h2>🔍 Advanced Search</h2>
            <input
              type="text"
              placeholder="Search with advanced filters..."
              class="advanced-search"
            />
          </section>
        }
      </main>
    </div>
  `,
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private configService = AppConfigService;

  constructor(private appConfig: AppConfigService) {}

  // Computed signals for ease of use
  appName = computed(() => this.appConfig.config?.appName ?? 'Dashboard Pro');
  appVersion = computed(() => this.appConfig.config?.appVersion ?? '1.0.0');
  apiUrl = computed(() => this.appConfig.config?.apiUrl ?? '');
  apiTimeout = computed(() => this.appConfig.config?.apiTimeout ?? 30000);
  loggingEnabled = computed(() => this.appConfig.config?.enableLogging ?? false);
  tenantName = computed(() => this.appConfig.tenant?.tenantName ?? '');
  logoUrl = computed(() => this.appConfig.tenant?.logo ?? '');
  brandColor = computed(() => this.appConfig.tenant?.brandColor ?? '#667eea');
  environment = computed(() =>
    this.apiUrl().includes('localhost') ? 'Development' : 'Production'
  );

  // Feature flags
  isAnalyticsEnabled = computed(() =>
    this.appConfig.isFeatureEnabled('enableAnalytics')
  );
  isDarkModeEnabled = computed(() =>
    this.appConfig.isFeatureEnabled('enableDarkMode')
  );
  isExportEnabled = computed(() =>
    this.appConfig.isFeatureEnabled('enableExportCSV')
  );
  isAdvancedSearchEnabled = computed(() =>
    this.appConfig.isFeatureEnabled('enableAdvancedSearch')
  );

  availableFeatures = computed(() => [
    {
      name: 'analytics',
      label: 'Analytics Dashboard',
      enabled: this.isAnalyticsEnabled(),
    },
    {
      name: 'darkMode',
      label: 'Dark Mode',
      enabled: this.isDarkModeEnabled(),
    },
    {
      name: 'export',
      label: 'CSV Export',
      enabled: this.isExportEnabled(),
    },
    {
      name: 'advancedSearch',
      label: 'Advanced Search',
      enabled: this.isAdvancedSearchEnabled(),
    },
  ]);

  darkMode = signal(false);

  toggleDarkMode(): void {
    this.darkMode.set(!this.darkMode());
  }

  exportAsCSV(): void {
    console.log('Exporting data as CSV...');
  }
}
```

### Step 6: Add Professional Styling

Create CSS for a polished dashboard:

```css
/* src/app/dashboard/dashboard.component.css */

:host {
  --brand-color: #667eea;
}

.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.dashboard-header {
  background: linear-gradient(135deg, var(--brand-color) 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  height: 50px;
  width: auto;
}

.dashboard-header h1 {
  font-size: 2rem;
  margin: 0;
}

.version {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.tenant-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
}

.feature-toggles {
  background: white;
  padding: 2rem;
  margin: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.feature-toggles h3 {
  margin-top: 0;
  color: #1a202c;
  font-size: 1.1rem;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f7fafc;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #2d3748;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: #edf2f7;
  transform: translateX(4px);
}

.feature-item.disabled {
  opacity: 0.6;
  color: #a0aec0;
}

.feature-status {
  font-weight: bold;
  font-size: 1.1rem;
}

.feature-item:not(.disabled) .feature-status {
  color: #48bb78;
}

.feature-item.disabled .feature-status {
  color: #cbd5e0;
}

.content-area {
  padding: 0 1.5rem 2rem;
}

.config-display {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.config-display h2 {
  color: #1a202c;
  font-size: 1.5rem;
  margin-top: 0;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.config-item {
  padding: 1rem;
  background: #f7fafc;
  border-radius: 6px;
  border-left: 4px solid var(--brand-color);
}

.config-item label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.config-item code {
  display: block;
  background: white;
  padding: 0.75rem;
  border-radius: 4px;
  color: var(--brand-color);
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.feature-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.feature-section h2 {
  color: #1a202c;
  margin-top: 0;
}

.feature-section p {
  color: #718096;
  margin-bottom: 1rem;
}

.feature-section button {
  padding: 0.75rem 1.5rem;
  background-color: var(--brand-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.feature-section button:hover {
  opacity: 0.9;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.advanced-search {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.advanced-search:focus {
  outline: none;
  border-color: var(--brand-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .header-content {
    justify-content: center;
  }

  .config-grid {
    grid-template-columns: 1fr;
  }

  .feature-list {
    grid-template-columns: 1fr;
  }
}
```

### Step 7: Advanced Pattern - Factory Functions

For more complex dependency creation, use factory functions:

```typescript
// src/app/config/config-factory.ts
import { InjectionToken } from '@angular/core';
import { AppConfig, FeatureFlags } from './app-config.token';

export const CONFIG_FACTORY = new InjectionToken<() => AppConfig>('config-factory');

export function createConfigFactory(environment: 'dev' | 'prod'): () => AppConfig {
  return () => {
    if (environment === 'prod') {
      return {
        appName: 'Dashboard Pro',
        appVersion: '1.0.0',
        apiUrl: 'https://api.example.com',
        apiTimeout: 15000,
        enableLogging: false,
      };
    }

    return {
      appName: 'Dashboard Pro',
      appVersion: '1.0.0-dev',
      apiUrl: 'http://localhost:3000/api',
      apiTimeout: 30000,
      enableLogging: true,
    };
  };
}

// Usage in app config:
{
  provide: CONFIG_FACTORY,
  useValue: createConfigFactory(
    process.env['NG_APP_ENV'] === 'production' ? 'prod' : 'dev'
  ),
}
```

### Step 8: Using Tokens in Services

Services can also consume injection tokens:

```typescript
// src/app/services/api.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, API_INTERCEPTOR_CONFIG } from '../config/app-config.token';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: any,
    @Inject(API_INTERCEPTOR_CONFIG) private interceptorConfig: any
  ) {}

  fetchData<T>(endpoint: string): Promise<T> {
    const url = `${this.config.apiUrl}/${endpoint}`;
    return this.http.get<T>(url).toPromise().then(data => data as T);
  }

  get retryAttempts(): number {
    return this.interceptorConfig.retryAttempts;
  }
}
```

## Advanced Injection Patterns

### 1. Multi-Value Tokens

Provide multiple implementations of the same token:

```typescript
const PLUGIN = new InjectionToken<Plugin>('plugin');

providers: [
  { provide: PLUGIN, useValue: new AnalyticsPlugin(), multi: true },
  { provide: PLUGIN, useValue: new LoggingPlugin(), multi: true },
  { provide: PLUGIN, useValue: new ErrorTrackingPlugin(), multi: true },
]

// Inject all plugins:
constructor(@Inject(PLUGIN) private plugins: Plugin[]) {}
```

### 2. Token Aliasing

Reference one token using another:

```typescript
const OLD_API_URL = new InjectionToken<string>('old-api-url');
const API_URL = new InjectionToken<string>('api-url');

providers: [
  { provide: API_URL, useValue: 'https://api.example.com' },
  { provide: OLD_API_URL, useExisting: API_URL }, // Alias
]
```

### 3. Conditional Providers

Use factory functions with conditions:

```typescript
const LOGGER = new InjectionToken<Logger>('logger');

providers: [
  {
    provide: LOGGER,
    useFactory: (config: AppConfig) => {
      if (config.enableLogging) {
        return new ConsoleLogger();
      }
      return new NoOpLogger();
    },
    deps: [APP_CONFIG],
  },
]
```

### 4. Optional Dependencies

Mark dependencies as optional with `@Optional()`:

```typescript
import { Optional, Inject } from '@angular/core';

constructor(
  @Optional() @Inject(ANALYTICS_TOKEN) private analytics?: AnalyticsService
) {
  if (this.analytics) {
    this.analytics.trackEvent('component-initialized');
  }
}
```

## Best Practices

### ✅ Do's

**1. Use Semantic Token Names**

```typescript
// ✅ Good - Clear intent
export const API_BASE_URL = new InjectionToken<string>('api-base-url');
export const API_TIMEOUT = new InjectionToken<number>('api-timeout');
export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('feature-flags');

// ❌ Bad - Unclear purpose
export const CONFIG = new InjectionToken<any>('config');
export const DATA = new InjectionToken<any>('data');
```

**2. Type Your Tokens Generically**

```typescript
// ✅ Good - Type-safe
export const USER_PREFERENCES = new InjectionToken<UserPreferences>('user-prefs');

// ❌ Bad - Loses type information
export const USER_PREFERENCES = new InjectionToken('user-prefs');
```

**3. Document Complex Tokens**

```typescript
/**
 * Feature flags token for toggling experimental features.
 * Used across the application to conditionally enable/disable functionality.
 *
 * @example
 * constructor(@Inject(FEATURE_FLAGS) private flags: FeatureFlags) {}
 */
export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('feature-flags');
```

**4. Group Related Tokens**

```typescript
// ✅ Good - Organized in a module
export namespace ApiConfig {
  export const BASE_URL = new InjectionToken<string>('api-base-url');
  export const TIMEOUT = new InjectionToken<number>('api-timeout');
  export const RETRY_ATTEMPTS = new InjectionToken<number>('api-retry-attempts');
}
```

### ❌ Don'ts

**1. Don't Mix Class and Injection Tokens**

```typescript
// ❌ Bad - Inconsistent patterns
providers: [
  CoffeeService,
  { provide: TEA_SERVICE, useClass: TeaService }
]
```

**2. Don't Create Tokens Without Purpose**

```typescript
// ❌ Bad - Unnecessary indirection
export const STRING_VALUE = new InjectionToken<string>('string-value');
providers: [{ provide: STRING_VALUE, useValue: 'hello' }]

// Use direct class injection or values when possible
```

**3. Don't Inject Deeply Nested Objects**

```typescript
// ❌ Bad - Brittle, hard to test
export const ENTIRE_CONFIG = new InjectionToken<any>('config');

// ✅ Good - Granular tokens
export const API_URL = new InjectionToken<string>('api-url');
export const API_TIMEOUT = new InjectionToken<number>('api-timeout');
```

**4. Don't Forget @Optional() When Appropriate**

```typescript
// ❌ Bad - Crashes if token not provided
constructor(@Inject(ANALYTICS) private analytics: Analytics) {}

// ✅ Good - Gracefully handles missing dependency
constructor(@Optional() @Inject(ANALYTICS) private analytics?: Analytics) {}
```

## Testing with Injection Tokens

Tokens make testing exceptionally easy by allowing easy mock replacement:

```typescript
// src/app/dashboard.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { APP_CONFIG, FEATURE_FLAGS, TENANT_CONFIG } from './config/app-config.token';

describe('DashboardComponent', () => {
  let component: DashboardComponent;

  beforeEach(async () => {
    const mockConfig = {
      appName: 'Test App',
      appVersion: '1.0.0-test',
      apiUrl: 'http://test-api.local',
      apiTimeout: 5000,
      enableLogging: true,
    };

    const mockFeatures = {
      enableAnalytics: true,
      enableDarkMode: false,
      enableBeta: true,
      enableExportCSV: true,
      enableAdvancedSearch: false,
    };

    const mockTenant = {
      tenantId: 'test-tenant',
      tenantName: 'Test Tenant',
      brandColor: '#ff0000',
      logo: '/test-logo.png',
    };

    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: APP_CONFIG, useValue: mockConfig },
        { provide: FEATURE_FLAGS, useValue: mockFeatures },
        { provide: TENANT_CONFIG, useValue: mockTenant },
      ],
    });

    component = TestBed.createComponent(DashboardComponent).componentInstance;
  });

  it('should display app name from config', () => {
    expect(component.appName()).toBe('Test App');
  });

  it('should enable analytics feature when flag is true', () => {
    expect(component.isAnalyticsEnabled()).toBe(true);
  });

  it('should disable advanced search when flag is false', () => {
    expect(component.isAdvancedSearchEnabled()).toBe(false);
  });
});
```

## When to Use Injection Tokens

### ✅ Use Injection Tokens When:

- **Configuration Management** - API URLs, timeouts, feature flags
- **Environment-Specific Values** - Dev vs. prod settings
- **Primitive Values** - Strings, numbers, booleans
- **Non-Class Objects** - Configuration objects, maps, collections
- **Conditional Injection** - Different implementations per environment
- **Multi-Value Dependencies** - Multiple implementations of the same interface
- **Dynamic Values** - Factory-generated dependencies
- **Scoped Dependencies** - Module or component-level providers

### ❌ Don't Use Injection Tokens When:

- **Simple Services** - Use class injection directly
- **Always One Implementation** - No benefit over class tokens
- **Primitive Values Without Configuration** - Hardcode if truly static
- **Single Use Dependencies** - Unnecessary abstraction layer

## Real-World Scenarios

### Scenario 1: Multi-Tenant SaaS

```typescript
export const TENANT_STORAGE = new InjectionToken<TenantStore>('tenant-storage');

providers: [
  {
    provide: TENANT_STORAGE,
    useFactory: (auth: AuthService) => {
      return new TenantStore(auth.currentTenant);
    },
    deps: [AuthService],
  },
]
```

### Scenario 2: Feature Flags via API

```typescript
export const FEATURE_FLAGS = new InjectionToken<Observable<FeatureFlags>>('feature-flags');

providers: [
  {
    provide: FEATURE_FLAGS,
    useFactory: (http: HttpClient) => {
      return http.get<FeatureFlags>('/api/flags').pipe(
        shareReplay(1),
        catchError(() => of(DEFAULT_FLAGS))
      );
    },
    deps: [HttpClient],
  },
]
```

### Scenario 3: Plugin System

```typescript
export const PLUGINS = new InjectionToken<Plugin[]>('plugins', {
  factory: () => [],
});

providers: [
  { provide: PLUGINS, useValue: new AnalyticsPlugin(), multi: true },
  { provide: PLUGINS, useValue: new CrashReportingPlugin(), multi: true },
]
```

## Comparison: Approaches to Dependency Configuration

| Approach | Use Case | Type Safety | Flexibility | Testing |
|----------|----------|------------|------------|---------|
| Class Injection | Services | ✅ Excellent | Medium | ✅ Easy |
| Injection Tokens | Configuration | ✅ Excellent | ✅ High | ✅ Easy |
| Environment Variables | Env-specific | ⚠️ Medium | Low | ❌ Hard |
| Config Files | Static config | ⚠️ Medium | Low | ❌ Hard |
| Service Locator | Dynamic deps | ❌ Poor | ✅ High | ❌ Hard |

## Conclusion

Injection Tokens are Angular's elegant solution to the "what if the dependency isn't a class?" problem. They unlock powerful patterns for configuration management, feature toggling, multi-tenancy support, and more.

By mastering Injection Tokens, you transform your Angular applications from rigid, tightly-coupled structures into flexible, maintainable architectures. You gain precise control over dependency injection, making testing trivial and configuration management painless.

The cafe metaphor might seem whimsical, but it captures the essence: the injector is your waiter, tokens are your orders, and providers are your recipes. With this mental model and the patterns shown in this guide, you're ready to architect sophisticated Angular applications with confidence.

Your future self – and your team – will thank you for leveraging this powerful feature.

## Resources

- [Complete Working Example on GitHub](https://github.com/devendramilmile121/angular-injection-tokens-demo) - Full source code with all examples
- [Angular Dependency Injection Guide](https://angular.dev/guide/dependency-injection)
- [Injection Token API Documentation](https://angular.dev/api/core/InjectionToken)
- [Advanced DI Patterns](https://angular.dev/guide/creating-injectable-service)
- [Angular Testing with DI](https://angular.dev/guide/testing-services)
- [Multi-Provider Pattern](https://angular.dev/guide/dependency-injection-providers)

---

*Have you implemented creative injection token patterns in your Angular applications? Share your use cases and innovative configurations in the comments below! What configuration challenge did tokens solve for you?*
