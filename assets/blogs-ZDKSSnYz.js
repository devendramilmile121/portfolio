import{m}from"./vendor-gray-matter-Dpq0orFq.js";import{b as p}from"./vendor-buffer-HHLfHZBm.js";const d=`---
title: "Angular Component Communication: Complete Guide with Best Practices"
date: "2025-11-23"
summary: "Master component communication in Angular with real-world examples covering parent-child communication, shared services, RxJS patterns, and advanced techniques."
tags: ["Angular", "TypeScript", "Component Communication", "RxJS", "Angular", "Best Practices"]
---

# Angular Component Communication: Complete Guide with Best Practices

Component communication is one of the most fundamental concepts in Angular. Whether you're building a small application or a large-scale enterprise system, understanding how components interact is crucial. In this comprehensive guide, we'll explore all the patterns and best practices for component communication in Angular.

## Table of Contents

1. [Parent to Child Communication](#parent-to-child-communication)
2. [Child to Parent Communication](#child-to-parent-communication)
3. [Sibling Component Communication](#sibling-component-communication)
4. [Unrelated Component Communication](#unrelated-component-communication)
5. [Advanced Patterns](#advanced-patterns)
6. [Best Practices](#best-practices)

---

## Parent to Child Communication

The most straightforward type of communication in Angular is passing data from a parent component to a child component using \`@Input\` decorator.

### Using @Input Decorator

**Best Practice**: Use typed inputs and consider using Angular's new control flow syntax for better readability.

#### Parent Component

\`\`\`typescript
import { Component } from '@angular/core';
import { ChildComponent } from './child.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [CommonModule, FormsModule, ChildComponent],
  template: \`
    <div class="parent-container">
      <h1>Parent Component</h1>
      
      <input 
        [(ngModel)]="currentUser.name" 
        placeholder="Enter user name"
        class="input-field"
      />
      
      <!-- Angular Control Flow -->
      @if (currentUser; as user) {
        <app-child 
          [user]="user"
          [isAdmin]="user.role === 'admin'"
          [itemCount]="items.length"
        />
      }
      
      <p>Total items: {{ items.length }}</p>
    </div>
  \`,
  styles: [\`
    .parent-container {
      padding: 20px;
      border: 2px solid #4CAF50;
      border-radius: 8px;
    }
    
    .input-field {
      padding: 8px;
      margin: 10px 0;
      width: 300px;
    }
  \`]
})
export class ParentComponent {
  currentUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  };

  items = [
    { id: 1, title: 'Item 1' },
    { id: 2, title: 'Item 2' },
    { id: 3, title: 'Item 3' }
  ];
}
\`\`\`

#### Child Component

\`\`\`typescript
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="child-container">
      <h2>Child Component</h2>
      
      @if (user) {
        <div class="user-info">
          <p><strong>Name:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Role:</strong> {{ user.role }}</p>
          
          @if (isAdmin) {
            <span class="admin-badge">Admin User</span>
          }
        </div>
      }
      
      <p class="item-count">Items available: {{ itemCount }}</p>
    </div>
  \`,
  styles: [\`
    .child-container {
      padding: 15px;
      margin-top: 15px;
      border: 2px solid #2196F3;
      border-radius: 8px;
      background-color: #f5f5f5;
    }
    
    .user-info {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
    }
    
    .admin-badge {
      background-color: #FF9800;
      color: white;
      padding: 5px 10px;
      border-radius: 3px;
      font-weight: bold;
      display: inline-block;
      margin-top: 10px;
    }
    
    .item-count {
      color: #666;
      margin-top: 10px;
    }
  \`]
})
export class ChildComponent {
  @Input() user: User | null = null;
  @Input() isAdmin: boolean = false;
  @Input() itemCount: number = 0;
}
\`\`\`

### Advanced: Input Aliases and Getters/Setters

\`\`\`typescript
@Component({
  selector: 'app-advanced-child',
  standalone: true,
  template: \`
    <div>
      <p>Processing value: {{ processedValue }}</p>
    </div>
  \`
})
export class AdvancedChildComponent {
  // Alias for cleaner template syntax
  @Input('userData') user: User | null = null;
  
  // Using setter to intercept changes
  private _itemCount: number = 0;
  
  @Input()
  set itemCount(count: number) {
    this._itemCount = count;
    console.log(\`Items updated to: \${count}\`);
    this.validateItemCount();
  }
  
  get itemCount(): number {
    return this._itemCount;
  }
  
  get processedValue(): string {
    return \`Processed \${this.itemCount} items\`;
  }
  
  private validateItemCount(): void {
    if (this.itemCount < 0) {
      console.warn('Item count cannot be negative');
      this._itemCount = 0;
    }
  }
}
\`\`\`

---

## Child to Parent Communication

Child components can communicate with their parent using the \`@Output\` decorator and EventEmitter.

### Using @Output and EventEmitter

**Best Practice**: Use strongly-typed events and follow Angular's naming conventions.

#### Child Component

\`\`\`typescript
import { Component, Output, EventEmitter } from '@angular/core';

interface FormData {
  username: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-form-child',
  standalone: true,
  template: \`
    <div class="form-container">
      <h3>Submit Your Information</h3>
      
      <form (ngSubmit)="onSubmit()">
        <input 
          [(ngModel)]="formData.username"
          name="username"
          placeholder="Username"
          required
        />
        
        <input 
          [(ngModel)]="formData.email"
          name="email"
          placeholder="Email"
          type="email"
          required
        />
        
        <textarea 
          [(ngModel)]="formData.message"
          name="message"
          placeholder="Message"
          rows="4"
        ></textarea>
        
        <button type="submit" [disabled]="!isFormValid()">
          Submit
        </button>
      </form>
    </div>
  \`,
  styles: [\`
    .form-container {
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    
    input, textarea {
      width: 100%;
      padding: 8px;
      margin: 8px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  \`]
})
export class FormChildComponent {
  @Output() formSubmitted = new EventEmitter<FormData>();
  
  formData: FormData = {
    username: '',
    email: '',
    message: ''
  };
  
  isFormValid(): boolean {
    return !!(
      this.formData.username.trim() &&
      this.formData.email.trim() &&
      this.formData.message.trim()
    );
  }
  
  onSubmit(): void {
    if (this.isFormValid()) {
      this.formSubmitted.emit(this.formData);
      this.resetForm();
    }
  }
  
  private resetForm(): void {
    this.formData = {
      username: '',
      email: '',
      message: ''
    };
  }
}
\`\`\`

#### Parent Component Handling Output

\`\`\`typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormChildComponent } from './form-child.component';

interface FormData {
  username: string;
  email: string;
  message: string;
}

interface SubmissionRecord {
  id: number;
  data: FormData;
  timestamp: Date;
}

@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [CommonModule, FormsModule, FormChildComponent],
  template: \`
    <div class="parent-container">
      <h1>Parent Component - Form Handler</h1>
      
      <app-form-child (formSubmitted)="onFormSubmitted($event)" />
      
      <div class="submissions">
        <h3>Submissions ({{ submissions.length }})</h3>
        
        @if (submissions.length > 0) {
          <ul>
            @for (submission of submissions; track submission.id) {
              <li>
                <strong>{{ submission.data.username }}</strong> ({{ submission.data.email }})
                <p>{{ submission.data.message }}</p>
                <small>{{ submission.timestamp | date:'short' }}</small>
              </li>
            }
          </ul>
        } @else {
          <p class="no-data">No submissions yet</p>
        }
      </div>
    </div>
  \`,
  styles: [\`
    .parent-container {
      padding: 20px;
    }
    
    .submissions {
      margin-top: 30px;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 5px;
    }
    
    ul {
      list-style: none;
      padding: 0;
    }
    
    li {
      padding: 10px;
      margin: 10px 0;
      background-color: white;
      border-left: 4px solid #4CAF50;
      border-radius: 3px;
    }
    
    .no-data {
      color: #999;
      font-style: italic;
    }
  \`]
})
export class ParentComponent {
  submissions: SubmissionRecord[] = [];
  private submissionCounter = 1;
  
  onFormSubmitted(data: FormData): void {
    const record: SubmissionRecord = {
      id: this.submissionCounter++,
      data,
      timestamp: new Date()
    };
    
    this.submissions.push(record);
    console.log('Form submitted:', record);
  }
}
\`\`\`

---

## Sibling Component Communication

When two components are at the same level (siblings), they need to communicate through a shared parent or a service.

### Method 1: Through Parent Component

\`\`\`typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Sibling 1: Sender
@Component({
  selector: 'app-sibling-sender',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="sibling-container sender">
      <h3>Sibling 1: Sender</h3>
      <input 
        [(ngModel)]="message"
        placeholder="Enter message"
      />
      <button (click)="send()">Send to Sibling 2</button>
    </div>
  \`,
  styles: [\`
    .sibling-container {
      padding: 15px;
      margin: 10px;
      border: 2px solid #4CAF50;
      border-radius: 5px;
    }
    
    .sender {
      background-color: #e8f5e9;
    }
  \`]
})
export class SiblingSenderComponent {
  message: string = '';
  
  constructor(private parent: SiblingParentComponent) {}
  
  send(): void {
    if (this.message.trim()) {
      this.parent.shareMessage(this.message);
      this.message = '';
    }
  }
}

// Sibling 2: Receiver
@Component({
  selector: 'app-sibling-receiver',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="sibling-container receiver">
      <h3>Sibling 2: Receiver</h3>
      
      @if (messages.length > 0) {
        <div class="messages">
          @for (msg of messages; track $index) {
            <p class="message">{{ msg }}</p>
          }
        </div>
      } @else {
        <p class="placeholder">Waiting for messages...</p>
      }
    </div>
  \`,
  styles: [\`
    .sibling-container {
      padding: 15px;
      margin: 10px;
      border: 2px solid #2196F3;
      border-radius: 5px;
    }
    
    .receiver {
      background-color: #e3f2fd;
    }
    
    .messages {
      max-height: 200px;
      overflow-y: auto;
    }
    
    .message {
      background-color: white;
      padding: 8px;
      margin: 5px 0;
      border-radius: 3px;
      border-left: 3px solid #2196F3;
    }
    
    .placeholder {
      color: #999;
      font-style: italic;
    }
  \`]
})
export class SiblingReceiverComponent {
  messages: string[] = [];
  
  addMessage(msg: string): void {
    this.messages.push(msg);
  }
}

// Parent Component managing siblings
@Component({
  selector: 'app-sibling-parent',
  standalone: true,
  imports: [CommonModule, SiblingSenderComponent, SiblingReceiverComponent],
  template: \`
    <div class="parent-container">
      <h2>Sibling Communication via Parent</h2>
      
      <app-sibling-sender />
      <app-sibling-receiver #receiver />
    </div>
  \`,
  styles: [\`
    .parent-container {
      padding: 20px;
      border: 3px solid #666;
      border-radius: 8px;
      background-color: #fafafa;
    }
  \`]
})
export class SiblingParentComponent {
  @ViewChild(SiblingReceiverComponent) receiverComponent!: SiblingReceiverComponent;
  
  shareMessage(message: string): void {
    this.receiverComponent.addMessage(message);
  }
}
\`\`\`

### Method 2: Using a Shared Service (Better Approach)

\`\`\`typescript
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageSubject = new Subject<string>();
  public message$ = this.messageSubject.asObservable();
  
  sendMessage(message: string): void {
    this.messageSubject.next(message);
  }
}

// Sibling Sender using Service
@Component({
  selector: 'app-service-sender',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="sender-container">
      <h3>Service Sender</h3>
      <input 
        [(ngModel)]="message"
        placeholder="Enter message"
      />
      <button (click)="send()">Send</button>
    </div>
  \`
})
export class ServiceSenderComponent {
  message: string = '';
  
  constructor(private messageService: MessageService) {}
  
  send(): void {
    if (this.message.trim()) {
      this.messageService.sendMessage(this.message);
      this.message = '';
    }
  }
}

// Sibling Receiver using Service
@Component({
  selector: 'app-service-receiver',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="receiver-container">
      <h3>Service Receiver</h3>
      
      @if (messages.length > 0) {
        <ul>
          @for (msg of messages; track $index) {
            <li>{{ msg }}</li>
          }
        </ul>
      } @else {
        <p>No messages received</p>
      }
    </div>
  \`
})
export class ServiceReceiverComponent implements OnInit, OnDestroy {
  messages: string[] = [];
  private destroy$ = new Subject<void>();
  
  constructor(private messageService: MessageService) {}
  
  ngOnInit(): void {
    this.messageService.message$
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => {
        this.messages.push(msg);
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
\`\`\`

---

## Unrelated Component Communication

For components with no hierarchical relationship, services with RxJS are the best approach.

### Using BehaviorSubject for State Management

\`\`\`typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
  theme: 'light' | 'dark';
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly initialState: UserState = {
    currentUser: null,
    isLoggedIn: false,
    theme: 'light'
  };
  
  private stateSubject = new BehaviorSubject<UserState>(this.initialState);
  public state$ = this.stateSubject.asObservable();
  
  // Selectors for specific properties
  public currentUser$ = this.state$.pipe(
    map(state => state.currentUser),
    distinctUntilChanged()
  );
  
  public isLoggedIn$ = this.state$.pipe(
    map(state => state.isLoggedIn),
    distinctUntilChanged()
  );
  
  public theme$ = this.state$.pipe(
    map(state => state.theme),
    distinctUntilChanged()
  );
  
  // Actions
  login(user: User): void {
    const newState: UserState = {
      ...this.stateSubject.value,
      currentUser: user,
      isLoggedIn: true
    };
    this.stateSubject.next(newState);
  }
  
  logout(): void {
    const newState: UserState = {
      ...this.stateSubject.value,
      currentUser: null,
      isLoggedIn: false
    };
    this.stateSubject.next(newState);
  }
  
  setTheme(theme: 'light' | 'dark'): void {
    const newState: UserState = {
      ...this.stateSubject.value,
      theme
    };
    this.stateSubject.next(newState);
  }
  
  getCurrentState(): UserState {
    return this.stateSubject.value;
  }
}

// Component 1: Login Component
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: \`
    <div class="login-form">
      <h3>Login</h3>
      <input [(ngModel)]="email" placeholder="Email" />
      <input [(ngModel)]="name" placeholder="Name" />
      <button (click)="login()">Login</button>
    </div>
  \`
})
export class LoginComponent {
  email: string = '';
  name: string = '';
  
  constructor(private stateService: StateService) {}
  
  login(): void {
    const user: User = {
      id: 1,
      name: this.name,
      email: this.email,
      role: 'user'
    };
    this.stateService.login(user);
  }
}

// Component 2: User Profile (unrelated to login)
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="profile">
      @if (currentUser$ | async as user) {
        <h3>Profile</h3>
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
      } @else {
        <p>Not logged in</p>
      }
    </div>
  \`
})
export class UserProfileComponent {
  currentUser$ = this.stateService.currentUser$;
  
  constructor(private stateService: StateService) {}
}

// Component 3: Settings (unrelated to both)
@Component({
  selector: 'app-settings',
  standalone: true,
  template: \`
    <div class="settings">
      <h3>Settings</h3>
      <button (click)="toggleTheme()">
        Toggle Theme: {{ (theme$ | async) || 'light' }}
      </button>
    </div>
  \`
})
export class SettingsComponent {
  theme$ = this.stateService.theme$;
  
  constructor(private stateService: StateService) {}
  
  toggleTheme(): void {
    const current = this.stateService.getCurrentState();
    const newTheme = current.theme === 'light' ? 'dark' : 'light';
    this.stateService.setTheme(newTheme);
  }
}
\`\`\`

---

## Advanced Patterns

### Using RxJS Operators for Complex Communication

\`\`\`typescript
import { Injectable } from '@angular/core';
import { Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchSubject = new Subject<string>();
  
  public searchResults$ = this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(query => this.performSearch(query)),
    catchError(error => {
      console.error('Search error:', error);
      return of([]);
    })
  );
  
  search(query: string): void {
    this.searchSubject.next(query);
  }
  
  private performSearch(query: string) {
    // Simulate API call
    return of([
      { id: 1, title: \`Result for "\${query}" 1\` },
      { id: 2, title: \`Result for "\${query}" 2\` }
    ]);
  }
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: \`
    <div class="search-container">
      <input 
        [(ngModel)]="searchQuery"
        (ngModelChange)="onSearch($event)"
        placeholder="Search..."
      />
      
      @if (results$ | async as results) {
        <ul>
          @for (result of results; track result.id) {
            <li>{{ result.title }}</li>
          }
        </ul>
      }
    </div>
  \`
})
export class SearchComponent {
  searchQuery: string = '';
  results$ = this.searchService.searchResults$;
  
  constructor(private searchService: SearchService) {}
  
  onSearch(query: string): void {
    this.searchService.search(query);
  }
}
\`\`\`

### ViewChild and ViewChildren for Direct Access

\`\`\`typescript
import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: \`
    <app-child #child1 />
    <app-child #child2 />
    <app-child #child3 />
    
    <button (click)="callChildMethods()">Call Child Methods</button>
  \`
})
export class ParentComponent {
  @ViewChild('child1') firstChild!: ChildComponent;
  @ViewChildren(ChildComponent) allChildren!: QueryList<ChildComponent>;
  
  callChildMethods(): void {
    // Call method on first child
    this.firstChild.doSomething();
    
    // Call methods on all children
    this.allChildren.forEach(child => child.refresh());
  }
}

@Component({
  selector: 'app-child',
  template: \`<p>{{ message }}</p>\`
})
export class ChildComponent {
  message: string = 'Initial';
  
  doSomething(): void {
    this.message = 'Modified by parent';
  }
  
  refresh(): void {
    console.log('Refreshing...');
  }
}
\`\`\`

---

## Best Practices

### 1. **Use Input for Read-Only Data**

✅ **Good**:
\`\`\`typescript
@Input() readonly user: User | null = null;
\`\`\`

❌ **Avoid**:
\`\`\`typescript
@Input() user: User | null = null; // Can be mutated
\`\`\`

### 2. **Unsubscribe from Observables**

✅ **Good**:
\`\`\`typescript
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.service.data$
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => { /* ... */ });
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
\`\`\`

### 3. **Use Services for Global State**

✅ **Good**:
\`\`\`typescript
export class AppStateService {
  private stateSubject = new BehaviorSubject<AppState>(initialState);
  state$ = this.stateSubject.asObservable();
}
\`\`\`

### 4. **Keep Components Focused**

✅ **Good**: Each component has a single responsibility

❌ **Avoid**: Overloaded components with multiple concerns

### 5. **Use Type Safety**

✅ **Good**:
\`\`\`typescript
@Input() user: User | null = null;
@Output() userUpdated = new EventEmitter<User>();
\`\`\`

❌ **Avoid**:
\`\`\`typescript
@Input() user: any;
@Output() userUpdated = new EventEmitter();
\`\`\`

### 6. **Async Pipe in Templates**

✅ **Good**:
\`\`\`typescript
{{ (user$ | async)?.name }}
\`\`\`

❌ **Avoid**:
\`\`\`typescript
// Subscribing in component and storing
user: User | null = null;
ngOnInit() {
  this.service.user$.subscribe(u => this.user = u);
}
\`\`\`

### 7. **Use ChangeDetectionStrategy.OnPush**

\`\`\`typescript
@Component({
  selector: 'app-optimized-child',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`...\`
})
export class OptimizedComponent {
  @Input() data: any;
}
\`\`\`

---

## Summary

| Pattern | Use Case | Pros | Cons |
|---------|----------|------|------|
| **@Input** | Parent → Child | Simple, Direct | One-way only |
| **@Output** | Child → Parent | Simple, Direct | One-way only |
| **Service + Observable** | Any component | Flexible, Scalable | Requires RxJS knowledge |
| **BehaviorSubject** | Shared State | Latest value available | Memory management needed |
| **ViewChild** | Direct Access | Powerful | Not recommended for frequent use |
| **State Management** | Complex Apps | Centralized | Overkill for small apps |

---

## Conclusion

Angular provides multiple ways to communicate between components. The best approach depends on your use case:

- **Parent ↔ Child**: Use @Input/@Output
- **Siblings**: Use Shared Service
- **Unrelated Components**: Use Services with RxJS
- **Complex State**: Use BehaviorSubject or State Management

Always remember to:
- ✅ Unsubscribe from observables
- ✅ Use type safety
- ✅ Keep components focused
- ✅ Follow Angular best practices
- ✅ Consider performance with OnPush strategy

Happy coding! 🚀
`,u=`---
title: "Mastering Angular Signals: Practical Guide With Real-World Examples (2025)"
date: "2025-11-23"
summary: "Angular Signals are the biggest reactivity upgrade since RxJS. This guide explains signals with practical use cases, patterns, and clean examples every developer should know."
tags: ["Angular", "Angular Signals", "Reactivity", "Frontend Architecture", "TypeScript", "Best Practices"]
---

# Mastering Angular Signals: Practical Guide With Real-World Examples (2025)

Angular Signals completely change how we manage state and build reactive UIs. They provide a **simpler**, **faster**, and **more predictable** reactivity model compared to RxJS and traditional change detection.

This guide will help you understand signals with **clear examples**, **real-world patterns**, and **best practices used in enterprise-scale applications**.

## Table of Contents

1. [What Are Signals?](#what-are-signals)
2. [Creating and Using Signals](#creating-and-using-signals)
3. [Computed Signals](#computed-signals)
4. [Effect Signals](#effect-signals)
5. [Signal-Based Services](#signal-based-services)
6. [Signals vs RxJS — When to Use What](#signals-vs-rxjs)
7. [Real-World Use Cases](#real-world-use-cases)
8. [Best Practices](#best-practices)

---

## What Are Signals?

Signals are **reactive values** that notify the template when they change.

Think of a signal as:

- A variable  
- That automatically updates the UI  
- Without manual subscriptions  
- Without async pipes  
- Without cleanup code  

### Example:

\`\`\`ts
const count = signal(0);

count(); // get value → 0  
count.set(5); // update value  
count.update((prev) => prev + 1); // update with logic
\`\`\`

---

## Creating and Using Signals

### Component Example

\`\`\`ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \\\`
    <h2>Counter Example</h2>

    <p>Current Count: {{ count() }}</p>

    <button (click)="increment()">Increment</button>
    <button (click)="reset()">Reset</button>
  \\\`
})
export class CounterComponent {
  count = signal(0);

  increment() {
    this.count.update(c => c + 1);
  }

  reset() {
    this.count.set(0);
  }
}
\`\`\`

---

## Computed Signals

\`\`\`ts
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  template: \\\`
    <h2>Cart Summary</h2>
    <p>Total Items: {{ items().length }}</p>
    <p>Total Price: ₹{{ totalPrice() }}</p>
  \\\`
})
export class CartComponent {
  items = signal([
    { name: 'Laptop', price: 50000 },
    { name: 'Mouse', price: 1200 }
  ]);

  totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.price, 0)
  );
}
\`\`\`

---

## Effect Signals

\`\`\`ts
import { Component, signal, effect } from '@angular/core';

@Component({
  selector: 'app-effect-demo',
  standalone: true,
  template: \\\`
    <input [(ngModel)]="name()" (ngModelChange)="name.set($event)" />
    <p>Hello, {{ name() }}!</p>
  \\\`
})
export class EffectDemoComponent {
  name = signal('Dev');

  constructor() {
    effect(() => {
      console.log('Name updated:', this.name());
    });
  }
}
\`\`\`

---

## Signal-Based Services

\`\`\`ts
import { Injectable, signal, computed } from '@angular/core';

interface User {
  id: number;
  name: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserStore {
  private readonly _user = signal<User | null>(null);
  readonly user = computed(() => this._user());
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  login(user: User) {
    this._user.set(user);
  }

  logout() {
    this._user.set(null);
  }
}
\`\`\`

---

## Signals vs RxJS

| Feature | Signals | RxJS |
|--------|---------|------|
| Template reactivity | ⭐ Best | Requires async pipe |
| Managing single values | ⭐ Best | Overkill |
| Complex streams | ❌ Not ideal | ⭐ Best |
| Operators | Limited | Huge set |
| Data fetching | Good | ⭐ Excellent |
| Component state | ⭐ Best | Good |
| Cross-component state | ⭐ Great | Great |

---

## Real-World Use Cases

- Form State  
- Dark Mode Toggle  
- Pagination  
- Shopping Cart  
- Modal State  

---

## Best Practices

- Use readonly computed signals  
- Use signals for UI state  
- Prefer \`update()\` for immutability  
- Avoid deep nested signal objects  
- Use effects only for side effects  

---

## Conclusion

Angular Signals make reactivity simpler, faster, and more predictable. They are perfect for managing UI state and improving application performance. Combine Signals with RxJS for powerful hybrid architectures.

Happy coding! 🚀
`,g=`---
title: "Getting Started with React: A Complete Guide"
date: "2025-11-20"
summary: "Learn the fundamentals of React, including components, hooks, and state management. Perfect for beginners starting their React journey."
tags: ["react", "javascript", "web-development", "tutorial"]
---

# Getting Started with React: A Complete Guide

React has revolutionized the way we build user interfaces. If you're just starting your React journey, this guide will help you understand the core concepts and get you up to speed quickly.

## What is React?

React is a JavaScript library for building user interfaces with reusable components. It uses a virtual DOM to efficiently update the UI whenever data changes.

### Key Features

- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: Describe what the UI should look like
- **Learn Once, Write Anywhere**: Use React to build web and mobile apps

## React Fundamentals

### 1. Components

React components are reusable pieces of UI. They can be functional or class-based:

\`\`\`jsx
// Functional Component
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Or using ES6 arrow function
const Welcome = ({ name }) => <h1>Hello, {name}!</h1>;
\`\`\`

### 2. JSX

JSX is a syntax extension that allows you to write HTML-like code in JavaScript:

\`\`\`jsx
const element = (
  <div>
    <h1>Welcome</h1>
    <p>This is JSX syntax</p>
  </div>
);
\`\`\`

### 3. State and Props

- **Props**: Pass data from parent to child components
- **State**: Manage component data that can change

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
\`\`\`

## React Hooks

Hooks let you use state and other React features in functional components:

### useState Hook

\`\`\`jsx
const [state, setState] = useState(initialValue);
\`\`\`

### useEffect Hook

\`\`\`jsx
useEffect(() => {
  // Side effects go here
  return () => {
    // Cleanup function (optional)
  };
}, [dependencies]);
\`\`\`

### Custom Hooks

You can create your own hooks to share logic:

\`\`\`jsx
function useCustomHook() {
  const [value, setValue] = useState('');
  
  return [value, setValue];
}
\`\`\`

## Best Practices

| Practice | Description |
|----------|-------------|
| Keep components small | Single responsibility principle |
| Use keys in lists | Helps React identify which items changed |
| Lift state up | Share state between sibling components |
| Use React DevTools | Debug your React app efficiently |

## Checklist for Beginners

- [ ] Understand JSX syntax
- [ ] Learn about components (functional vs class)
- [ ] Master useState hook
- [ ] Practice useEffect hook
- [ ] Create your first component
- [ ] Build a small project

## Conclusion

React is powerful and flexible. Start with these fundamentals, practice regularly, and gradually explore advanced concepts like context API, Redux, and performance optimization.

Happy coding! 🚀
`,h=`---
title: "Web Performance Optimization: Making Your Site Lightning Fast"
date: "2025-11-15"
summary: "Learn practical techniques to optimize your web application's performance. Including image optimization, code splitting, and caching strategies."
tags: ["performance", "optimization", "web-development", "best-practices"]
---

# Web Performance Optimization: Making Your Site Lightning Fast

Performance is critical for user experience and SEO. A slow website frustrates users and can hurt your search rankings. Let's explore practical techniques to make your site lightning fast.

## Why Performance Matters

- **User Experience**: 53% of users abandon sites that take more than 3 seconds to load
- **SEO Ranking**: Google considers page speed a ranking factor
- **Conversions**: Every 100ms delay costs ~1% of sales
- **Mobile Users**: Slow sites are especially problematic on mobile networks

## Core Web Vitals

Google uses three metrics to measure page experience:

### 1. Largest Contentful Paint (LCP)

Measures when the largest content element becomes visible.

- **Good**: < 2.5 seconds
- **Needs improvement**: 2.5s - 4s
- **Poor**: > 4 seconds

### 2. First Input Delay (FID)

Measures the delay between user input and browser response.

- **Good**: < 100 milliseconds
- **Needs improvement**: 100ms - 300ms
- **Poor**: > 300 milliseconds

### 3. Cumulative Layout Shift (CLS)

Measures visual stability during page load.

- **Good**: < 0.1
- **Needs improvement**: 0.1 - 0.25
- **Poor**: > 0.25

## Performance Optimization Techniques

### 1. Image Optimization

Images typically make up 50% of page weight.

\`\`\`markdown
// Use modern formats
- WebP: Better compression than JPEG/PNG
- AVIF: Even better compression than WebP

// Responsive images
<picture>
  <source srcSet="image.avif" type="image/avif" />
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="description" />
</picture>

// Lazy loading
<img src="image.jpg" alt="description" loading="lazy" />
\`\`\`

### 2. Code Splitting

Reduce JavaScript bundle size by splitting code:

\`\`\`jsx
import { lazy, Suspense } from 'react';

const BlogDetail = lazy(() => import('./pages/BlogDetail'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogDetail />
    </Suspense>
  );
}
\`\`\`

### 3. Minification and Compression

- **Minification**: Remove unnecessary characters from code
- **Gzip**: Compress text-based files (typically 70% reduction)
- **Brotli**: Better compression than Gzip (10-20% more reduction)

### 4. Caching Strategies

\`\`\`javascript
// Service Worker caching
const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
\`\`\`

### 5. Browser Caching

Set appropriate cache headers:

\`\`\`
Cache-Control: public, max-age=31536000
Cache-Control: public, max-age=3600
Cache-Control: no-cache, must-revalidate
\`\`\`

### 6. Critical CSS

Inline critical CSS needed for initial render:

\`\`\`html
<style>
  /* Critical styles for above-the-fold content */
  body { font-family: sans-serif; }
  .hero { padding: 20px; }
</style>
<link rel="stylesheet" href="/non-critical.css" />
\`\`\`

### 7. Defer Non-Critical JavaScript

\`\`\`html
<!-- Deferred scripts load after page render -->
<script defer src="/analytics.js"><\/script>

<!-- Async scripts load in parallel -->
<script async src="/third-party.js"><\/script>
\`\`\`

## Performance Metrics and Tools

### Tools for Measurement

| Tool | Purpose |
|------|---------|
| Google Lighthouse | Comprehensive audit tool |
| PageSpeed Insights | Performance analysis with real user data |
| WebPageTest | Detailed waterfall analysis |
| Chrome DevTools | In-browser profiling |
| Sentry | Real-time error monitoring |

### Example Lighthouse Score Targets

- ✅ Performance: 90+
- ✅ Accessibility: 90+
- ✅ Best Practices: 90+
- ✅ SEO: 95+

## Checklist for Performance Optimization

- [ ] Images are optimized and use modern formats
- [ ] Code is split and lazy-loaded
- [ ] Minification and compression enabled
- [ ] Caching strategy implemented
- [ ] Critical CSS inlined
- [ ] Non-critical JS deferred/async
- [ ] Third-party scripts isolated
- [ ] Database queries optimized
- [ ] CDN for static assets
- [ ] Regular performance audits

## Performance Budget

Set performance budgets for your project:

\`\`\`json
{
  "bundles": [
    {
      "name": "main",
      "maxSize": "150kb"
    },
    {
      "name": "vendor",
      "maxSize": "100kb"
    }
  ]
}
\`\`\`

## Conclusion

Performance optimization is an ongoing process. Continuously monitor your metrics, use real user monitoring (RUM), and iterate on improvements. Small optimizations across many areas compound into significant gains.

Remember: **A fast website is a better website.** 🚀

---

*Last updated: November 15, 2025*
`;typeof global>"u"&&(window.global=window);window.Buffer=p.Buffer;const b=Object.assign({"../blogs/angular-component-communication.md":d,"../blogs/angular-signals.md":u,"../blogs/getting-started-with-react.md":g,"../blogs/web-performance-optimization.md":h});let a=null;async function f(){if(a)return a;const n=[];for(const[e,t]of Object.entries(b))try{const i=(e.split("/").pop()||"").replace(".md","").toLowerCase(),r=String(t),{data:l,content:c}=m(r),o=l;n.push({slug:i,title:o.title,date:o.date,summary:o.summary,tags:o.tags||[],body:c})}catch(s){console.error(`[Blogs] Error loading blog ${e}:`,s)}return n.sort((e,t)=>new Date(t.date).getTime()-new Date(e.date).getTime()),a=n,n}async function S(n){return(await f()).find(s=>s.slug===n)}export{S as g,f as l};
