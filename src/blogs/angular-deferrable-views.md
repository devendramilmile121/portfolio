---
title: "Angular Deferrable Views: Optimizing Bundle Size with @defer Blocks"
date: "2026-01-26"
summary: "Master Angular's @defer blocks to intelligently defer non-critical code, improve Core Web Vitals, and create lightning-fast applications with granular control over lazy loading."
tags: ["Angular", "Performance", "Optimization", "Web Vitals", "TypeScript", "Web Development"]
---

# Angular Deferrable Views: Optimizing Bundle Size with @defer Blocks

In today's web landscape, performance is paramount. Users expect applications to load instantly, and search engines reward fast-loading sites. However, shipping entire applications upfront can lead to bloated bundles and slow initial loads. Enter **Deferrable Views** – Angular's declarative approach to lazy loading that allows you to defer non-critical code until it's truly needed.

With the `@defer` block, you can reduce your initial bundle size, improve Core Web Vitals (especially Largest Contentful Paint and Time to First Byte), and create a more responsive user experience.

## What Are Deferrable Views?

Deferrable views, also known as `@defer` blocks, allow you to declaratively defer the loading of components, directives, and pipes that aren't necessary for the initial page render. Instead of bundling all your code together, Angular splits deferred dependencies into separate JavaScript chunks that load only when needed.

Key benefits include:

- **Reduced initial bundle size** - Non-critical code is excluded from the main bundle
- **Faster initial load** - Less JavaScript to parse and execute on page load
- **Improved Core Web Vitals** - Better LCP, TTFB, and CLS scores
- **Flexible triggers** - Load content based on user interaction, viewport visibility, idle time, or custom conditions
- **Graceful state management** - Built-in support for placeholder, loading, and error states

## Prerequisites

To use deferrable views, you need:
- **Angular v17 or higher**
- Understanding of Angular components and templates
- Basic knowledge of bundle optimization concepts

## Getting Started with @defer Blocks

### Basic Syntax

The simplest `@defer` block requires just wrapping your content:

```typescript
@defer {
  <large-component />
}
```

By default, the deferred content loads when the browser reaches an idle state. However, `@defer` blocks become powerful when combined with triggers and state blocks.

## Building a Feature-Rich Product Dashboard

Let's build a practical example: a product dashboard that displays product listings, analytics charts, and recommendation widgets – all with intelligent lazy loading.

> 💻 **[Complete Working Example on GitHub](https://github.com/devendramilmile121/angular-defer-demo)** - Clone and run the full application with all the code from this tutorial!

### Step 1: Set Up the Component

Create a dashboard component that manages the overall structure and product data:

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  products = signal<Product[]>([
    { id: 1, name: 'Premium Headphones', price: 199.99, category: 'Electronics' },
    { id: 2, name: 'Wireless Keyboard', price: 79.99, category: 'Electronics' },
    { id: 3, name: 'Monitor Stand', price: 49.99, category: 'Accessories' },
    { id: 4, name: 'USB-C Cable', price: 19.99, category: 'Accessories' },
    { id: 5, name: 'Desk Lamp', price: 39.99, category: 'Accessories' },
    { id: 6, name: 'Webcam 4K', price: 129.99, category: 'Electronics' },
  ]);

  showCharts = signal(false);
}
```

### Step 2: Create Child Components

Create the components that will be deferred:

**Product List Component:**

`src/app/product-list/product-list.component.ts`:
```typescript
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  products = input<Product[]>([]);
}
```

`src/app/product-list/product-list.component.html`:
```html
<div class="products-grid">
  @for (product of products(); track product.id) {
    <div class="product-card">
      <h3>{{ product.name }}</h3>
      <p class="category">{{ product.category }}</p>
      <p class="price">${{ product.price }}</p>
      <button class="btn-add">Add to Cart</button>
    </div>
  }
</div>
```

**Analytics Chart Component:**

`src/app/analytics-chart/analytics-chart.component.ts`:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics-chart',
  standalone: true,
  templateUrl: './analytics-chart.component.html',
  styleUrl: './analytics-chart.component.css',
})
export class AnalyticsChartComponent {}
```

`src/app/analytics-chart/analytics-chart.component.html`:
```html
<div class="chart-container">
  <h3>Sales Analytics</h3>
  <div class="chart">
    <!-- In a real application, integrate Chart.js, D3, or similar library -->
    <div class="chart-placeholder">
      <p>📊 Interactive chart would render here</p>
      <p>Heavy charting library loaded on demand</p>
    </div>
  </div>
</div>
```

**Recommendations Component:**

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="recommendations">
      <h3>Recommended for You</h3>
      @for (item of recommendations(); track item.id) {
        <div class="recommendation-item">
          <p>{{ item.text }}</p>
          <small>Based on your browsing history</small>
        </div>
      }
    </div>
  `,
  styleUrl: './recommendations.component.css',
})
export class RecommendationsComponent {
  recommendations = signal([
    { id: 1, text: 'Premium USB-C Hub - Perfect match for your setup' },
    { id: 2, text: 'Ergonomic Mouse Pad - Complements your keyboard' },
    { id: 3, text: 'Monitor Light Bar - Reduces eye strain' },
  ]);
}
```

### Step 3: Build the Template with @defer Blocks

Now let's create the main dashboard template with strategic use of `@defer` blocks:

```typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from '../product-list/product-list.component';
import { AnalyticsChartComponent } from '../analytics-chart/analytics-chart.component';
import { RecommendationsComponent } from '../recommendations/recommendations.component';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProductListComponent,
    AnalyticsChartComponent,
    RecommendationsComponent,
  ],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Product Dashboard</h1>
        <p>Browse products and view personalized recommendations</p>
      </header>

      <!-- IMMEDIATE CONTENT - Always loads upfront -->
      <section class="hero-section">
        <div class="hero-content">
          <h2>Welcome to Our Store</h2>
          <p>Discover premium products for your workspace</p>
        </div>
      </section>

      <!-- Featured Products - Loads when viewport becomes visible -->
      <section class="featured-products">
        <h2>Featured Products</h2>
        @defer (on viewport) {
          <app-product-list [products]="products()" />
        } @placeholder {
          <div class="placeholder-skeleton">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
          </div>
        } @loading {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading products...</p>
          </div>
        } @error {
          <div class="error-state">
            <p>❌ Failed to load products. Please refresh the page.</p>
          </div>
        }
      </section>

      <!-- Analytics Section - Loads on user interaction (click) -->
      <section class="analytics-section">
        <button class="btn-toggle" (click)="showCharts.set(!showCharts())">
          {{ showCharts() ? 'Hide' : 'Show' }} Analytics
        </button>

        @if (showCharts()) {
          @defer (on interaction) {
            <app-analytics-chart />
          } @placeholder {
            <div class="chart-placeholder">
              Click to view analytics
            </div>
          } @loading (after 100ms; minimum 500ms) {
            <div class="loading-spinner">
              <span>Loading analytics...</span>
            </div>
          } @error {
            <div class="error-state">
              <p>⚠️ Could not load analytics chart</p>
            </div>
          }
        }
      </section>

      <!-- Recommendations - Loads after a delay using timer -->
      <section class="recommendations-section">
        @defer (on timer(3000)) {
          <app-recommendations />
        } @placeholder {
          <div class="placeholder-content">
            <p>Personalized recommendations coming soon...</p>
          </div>
        } @loading {
          <div class="loading-state">
            <p>Generating recommendations based on your preferences...</p>
          </div>
        }
      </section>

      <!-- Advanced Section - Prefetches on idle, loads on hover -->
      <section class="advanced-section" #advancedSection>
        <div class="section-header">
          <h3>Premium Features</h3>
          <p>Hover to unlock exclusive tools</p>
        </div>

        @defer (on hover(advancedSection); prefetch on idle) {
          <div class="premium-features">
            <div class="feature">
              <h4>Advanced Analytics</h4>
              <p>Deep insights into your sales</p>
            </div>
            <div class="feature">
              <h4>Custom Reports</h4>
              <p>Generate detailed business reports</p>
            </div>
            <div class="feature">
              <h4>Real-time Monitoring</h4>
              <p>Monitor metrics as they happen</p>
            </div>
          </div>
        } @placeholder {
          <div class="hover-prompt">
            👆 Hover over this section to load premium features
          </div>
        } @loading {
          <div class="loading-state">
            <p>Loading premium features...</p>
          </div>
        }
      </section>
    </div>
  `,
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  products = signal<Product[]>([
    { id: 1, name: 'Premium Headphones', price: 199.99, category: 'Electronics' },
    { id: 2, name: 'Wireless Keyboard', price: 79.99, category: 'Electronics' },
    { id: 3, name: 'Monitor Stand', price: 49.99, category: 'Accessories' },
    { id: 4, name: 'USB-C Cable', price: 19.99, category: 'Accessories' },
    { id: 5, name: 'Desk Lamp', price: 39.99, category: 'Accessories' },
    { id: 6, name: 'Webcam 4K', price: 129.99, category: 'Electronics' },
  ]);

  showCharts = signal(false);
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}
```

### Step 4: Add Styling

Create professional styles for the dashboard:

```css
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  font-size: 1.1rem;
  color: #718096;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  border-radius: 8px;
  margin-bottom: 3rem;
  text-align: center;
}

.hero-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.featured-products {
  margin-bottom: 3rem;
}

.featured-products h2 {
  font-size: 1.8rem;
  color: #1a202c;
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.product-card h3 {
  font-size: 1.2rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.product-card .category {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.product-card .price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 1rem;
}

.btn-add {
  width: 100%;
  padding: 0.75rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-add:hover {
  background-color: #5568d3;
}

/* Placeholder and Loading States */
.placeholder-skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.skeleton-card {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  height: 250px;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: #f7fafc;
  border-radius: 8px;
  color: #4a5568;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  padding: 2rem;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  color: #c53030;
  text-align: center;
}

.analytics-section {
  margin-bottom: 3rem;
}

.btn-toggle {
  padding: 0.75rem 1.5rem;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  margin-bottom: 2rem;
}

.btn-toggle:hover {
  background-color: #5568d3;
}

.chart-container {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.chart {
  min-height: 300px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: #f7fafc;
  border-radius: 4px;
  color: #718096;
  text-align: center;
}

.recommendations-section {
  margin-bottom: 3rem;
  background: #edf2f7;
  padding: 2rem;
  border-radius: 8px;
}

.recommendations {
  background: white;
  padding: 2rem;
  border-radius: 8px;
}

.recommendations h3 {
  font-size: 1.5rem;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.recommendation-item {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f7fafc;
  border-left: 4px solid #667eea;
  border-radius: 4px;
}

.recommendation-item p {
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.recommendation-item small {
  color: #718096;
  font-size: 0.85rem;
}

.advanced-section {
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #faf089 0%, #f5f5f5 100%);
  border-radius: 8px;
}

.section-header h3 {
  font-size: 1.5rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: #718096;
  font-size: 0.95rem;
}

.premium-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.feature h4 {
  color: #667eea;
  margin-bottom: 0.5rem;
}

.feature p {
  color: #718096;
  font-size: 0.95rem;
}

.hover-prompt {
  padding: 2rem;
  text-align: center;
  color: #718096;
  font-size: 1rem;
  background: white;
  border-radius: 8px;
}

.placeholder-content {
  padding: 2rem;
  text-align: center;
  color: #718096;
  background: #f7fafc;
  border-radius: 8px;
}
```

## Key Concepts Explained

### 1. Which Dependencies Get Deferred?

For code to be deferred, dependencies must meet two conditions:

- **Must be standalone** - Components, directives, and pipes in `@defer` blocks must be declared as standalone
- **Cannot be referenced outside** - The dependency cannot be imported or used elsewhere in the same component template

```typescript
// ✅ Good - Can be deferred
@Component({
  selector: 'app-chart',
  standalone: true,
  template: `...`
})
export class ChartComponent {}

// ❌ Cannot be deferred if used elsewhere
@Component({
  selector: 'app-shared',
  template: `...`
})
export class SharedComponent {}
```

### 2. Understanding State Blocks

`@defer` blocks support multiple sub-blocks to manage the loading lifecycle:

- **`@placeholder`** - Content shown before loading triggers (eagerly loaded)
- **`@loading`** - Content shown while resources are being fetched
- **`@error`** - Content shown if loading fails

```typescript
@defer (on viewport) {
  <large-component />
} @placeholder {
  <div>Placeholder content</div>
} @loading (after 200ms; minimum 1s) {
  <div>Loading...</div>
} @error {
  <div>Failed to load</div>
}
```

### 3. Triggers - The Power of Control

Triggers determine when deferred content loads. Angular offers six built-in triggers and support for custom conditions:

**Event-based triggers:**
- `idle` - Load when browser is idle (default)
- `viewport` - Load when element enters viewport
- `interaction` - Load on click or keydown
- `hover` - Load on mouse hover

**Time-based triggers:**
- `timer(duration)` - Load after specified duration
- `immediate` - Load right after non-deferred content

**Conditional trigger:**
- `when condition` - Load when condition becomes truthy

### 4. Prefetching Strategy

Prefetching loads resources before they're needed, improving perceived performance:

```typescript
@defer (on interaction; prefetch on idle) {
  <large-component />
}
```

This prefetches while idle but only displays when user interacts – best of both worlds!

## Advanced Features

### Combining Multiple Triggers

Use semicolons to combine triggers (OR logic):

```typescript
@defer (on viewport; on interaction) {
  <lazy-component />
}
```

### IntersectionObserver Customization

Fine-tune viewport detection with observer options:

```typescript
<div #triggerElement></div>

@defer (on viewport({
  trigger: triggerElement, 
  rootMargin: '100px', 
  threshold: 0.5
})) {
  <lazy-component />
}
```

### Preventing Content Flicker

Use timing parameters to prevent rapid state transitions:

```typescript
@defer (on viewport) {
  <large-cmp />
} @loading (after 200ms; minimum 500ms) {
  <div>Loading...</div>
} @placeholder (minimum 300ms) {
  <div>Placeholder</div>
}
```

### Custom Conditional Loading

Load content based on your application state:

```typescript
@defer (when isUserLoggedIn() && hasAccessToken()) {
  <premium-feature />
}
```

## Best Practices

### 1. Avoid Cascading Nested @defer Blocks

```typescript
// ❌ Bad - Both blocks trigger on idle, causing cascade
@defer (on idle) {
  @defer (on idle) {
    <component-a />
  }
}

// ✅ Good - Different triggers prevent cascade
@defer (on idle) {
  @defer (on viewport) {
    <component-a />
  }
}
```

### 2. Avoid Layout Shifts

Don't defer components visible on initial load:

```typescript
// ❌ Bad - Component is above the fold
@defer (on immediate) {
  <hero-section />  // Visible on load!
}

// ✅ Good - Defer below-the-fold content
@defer (on viewport) {
  <footer-section />
}
```

### 3. Plan Placeholder Dimensions

Minimize Cumulative Layout Shift (CLS) with sized placeholders:

```html
<!-- ✅ Good - Placeholder has fixed height -->
@defer (on viewport) {
  <lazy-component />
} @placeholder {
  <div style="height: 400px; background: #f0f0f0;"></div>
}

<!-- ❌ Bad - Placeholder causes layout shift -->
@defer (on viewport) {
  <lazy-component />
} @placeholder {
  <p>Loading...</p>
}
```

### 4. Accessibility First

Ensure screen readers are aware of deferred content changes:

```html
<div aria-live="polite" aria-atomic="true">
  @defer (on viewport) {
    <product-details />
  } @placeholder {
    Loading product information...
  }
</div>
```

### 5. Test Defer Behavior

Angular provides testing utilities for `@defer` blocks:

```typescript
import { DeferBlockBehavior, DeferBlockState } from '@angular/core/testing';

it('should handle defer block states', async () => {
  TestBed.configureTestingModule({
    deferBlockBehavior: DeferBlockBehavior.Manual
  });

  const fixture = TestBed.createComponent(MyComponent);
  const [deferBlock] = await fixture.getDeferBlocks();

  // Manually control state progression
  await deferBlock.render(DeferBlockState.Placeholder);
  expect(fixture.nativeElement.innerHTML).toContain('Loading...');

  await deferBlock.render(DeferBlockState.Complete);
  expect(fixture.nativeElement.innerHTML).toContain('Content loaded');
});
```

## Comparison: Deferrable Views vs. Traditional Lazy Loading

| Feature | @defer Blocks | Route-based Lazy Loading | Manual Lazy Components |
|---------|-------------|--------------------------|----------------------|
| Ease of Use | ✅ Declarative | ⚠️ Requires routing | ❌ Complex |
| Bundle Size Reduction | ✅ Yes | ✅ Yes | ✅ Yes |
| Granular Control | ✅ Multiple triggers | ⚠️ Route-only | ⚠️ Manual |
| State Management | ✅ Built-in | ❌ Manual | ❌ Manual |
| Learning Curve | ✅ Low | Medium | High |
| Flexibility | ✅ Highly flexible | ⚠️ Limited | ✅ Very flexible |
| Component Overhead | ✅ Minimal | Medium | High |
| Best for | Page sections | App navigation | Special cases |

## When to Use @defer Blocks

**✅ Use @defer when:**
- You have heavy components not needed for initial render
- You want fine-grained control over lazy loading without routing
- Building dashboards with multiple non-critical sections
- Optimizing Core Web Vitals is a priority
- You need multiple trigger types for different content

**❌ Use route-based lazy loading when:**
- Navigating between distinct application sections
- Following traditional SPA patterns
- Each route represents a major feature area
- You want automatic code splitting per route

**❌ Avoid @defer when:**
- Content is critical for initial user experience
- Deferring would significantly impact perceived performance
- Component is referenced in multiple templates
- Using older Angular versions (< v17)

## Conclusion

Angular's `@defer` blocks represent a significant evolution in how we approach performance optimization. By moving from an all-or-nothing approach to intelligent, trigger-based code loading, developers can create applications that feel faster and more responsive.

The beauty of `@defer` lies in its simplicity – a single declarative syntax handles code splitting, prefetching, state management, and error handling. Whether you're deferring analytics charts, recommendation engines, or premium features, `@defer` gives you the tools to optimize your bundle size and improve the user experience.

As you build your next Angular application, think strategically about which components can be deferred. Your users will appreciate the faster load times, and your Core Web Vitals scores will thank you.

## Resources

- [Complete Working Example on GitHub](https://github.com/devendramilmile121/angular-defer-demo) - Full source code with all examples
- [Angular Deferrable Views Documentation](https://angular.dev/guide/defer)
- [Bundle Analysis Best Practices](https://angular.dev/guide/bundling-code-splitting)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Angular Performance Optimization](https://angular.dev/guide/performance-best-practices)

---

*Have you used @defer blocks in your Angular applications? Share your performance improvements and innovative trigger strategies in the comments below!*
