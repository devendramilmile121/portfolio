---
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

The most straightforward type of communication in Angular is passing data from a parent component to a child component using `@Input` decorator.

### Using @Input Decorator

**Best Practice**: Use typed inputs and consider using Angular's new control flow syntax for better readability.

#### Parent Component

```typescript
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
  template: `
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
  `,
  styles: [`
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
  `]
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
```

#### Child Component

```typescript
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
  template: `
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
  `,
  styles: [`
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
  `]
})
export class ChildComponent {
  @Input() user: User | null = null;
  @Input() isAdmin: boolean = false;
  @Input() itemCount: number = 0;
}
```

### Advanced: Input Aliases and Getters/Setters

```typescript
@Component({
  selector: 'app-advanced-child',
  standalone: true,
  template: `
    <div>
      <p>Processing value: {{ processedValue }}</p>
    </div>
  `
})
export class AdvancedChildComponent {
  // Alias for cleaner template syntax
  @Input('userData') user: User | null = null;
  
  // Using setter to intercept changes
  private _itemCount: number = 0;
  
  @Input()
  set itemCount(count: number) {
    this._itemCount = count;
    console.log(`Items updated to: ${count}`);
    this.validateItemCount();
  }
  
  get itemCount(): number {
    return this._itemCount;
  }
  
  get processedValue(): string {
    return `Processed ${this.itemCount} items`;
  }
  
  private validateItemCount(): void {
    if (this.itemCount < 0) {
      console.warn('Item count cannot be negative');
      this._itemCount = 0;
    }
  }
}
```

---

## Child to Parent Communication

Child components can communicate with their parent using the `@Output` decorator and EventEmitter.

### Using @Output and EventEmitter

**Best Practice**: Use strongly-typed events and follow Angular's naming conventions.

#### Child Component

```typescript
import { Component, Output, EventEmitter } from '@angular/core';

interface FormData {
  username: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-form-child',
  standalone: true,
  template: `
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
  `,
  styles: [`
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
  `]
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
```

#### Parent Component Handling Output

```typescript
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
  template: `
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
  `,
  styles: [`
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
  `]
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
```

---

## Sibling Component Communication

When two components are at the same level (siblings), they need to communicate through a shared parent or a service.

### Method 1: Through Parent Component

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Sibling 1: Sender
@Component({
  selector: 'app-sibling-sender',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="sibling-container sender">
      <h3>Sibling 1: Sender</h3>
      <input 
        [(ngModel)]="message"
        placeholder="Enter message"
      />
      <button (click)="send()">Send to Sibling 2</button>
    </div>
  `,
  styles: [`
    .sibling-container {
      padding: 15px;
      margin: 10px;
      border: 2px solid #4CAF50;
      border-radius: 5px;
    }
    
    .sender {
      background-color: #e8f5e9;
    }
  `]
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
  template: `
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
  `,
  styles: [`
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
  `]
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
  template: `
    <div class="parent-container">
      <h2>Sibling Communication via Parent</h2>
      
      <app-sibling-sender />
      <app-sibling-receiver #receiver />
    </div>
  `,
  styles: [`
    .parent-container {
      padding: 20px;
      border: 3px solid #666;
      border-radius: 8px;
      background-color: #fafafa;
    }
  `]
})
export class SiblingParentComponent {
  @ViewChild(SiblingReceiverComponent) receiverComponent!: SiblingReceiverComponent;
  
  shareMessage(message: string): void {
    this.receiverComponent.addMessage(message);
  }
}
```

### Method 2: Using a Shared Service (Better Approach)

```typescript
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
  template: `
    <div class="sender-container">
      <h3>Service Sender</h3>
      <input 
        [(ngModel)]="message"
        placeholder="Enter message"
      />
      <button (click)="send()">Send</button>
    </div>
  `
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
  template: `
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
  `
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
```

---

## Unrelated Component Communication

For components with no hierarchical relationship, services with RxJS are the best approach.

### Using BehaviorSubject for State Management

```typescript
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
  template: `
    <div class="login-form">
      <h3>Login</h3>
      <input [(ngModel)]="email" placeholder="Email" />
      <input [(ngModel)]="name" placeholder="Name" />
      <button (click)="login()">Login</button>
    </div>
  `
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
  template: `
    <div class="profile">
      @if (currentUser$ | async as user) {
        <h3>Profile</h3>
        <p>Name: {{ user.name }}</p>
        <p>Email: {{ user.email }}</p>
      } @else {
        <p>Not logged in</p>
      }
    </div>
  `
})
export class UserProfileComponent {
  currentUser$ = this.stateService.currentUser$;
  
  constructor(private stateService: StateService) {}
}

// Component 3: Settings (unrelated to both)
@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="settings">
      <h3>Settings</h3>
      <button (click)="toggleTheme()">
        Toggle Theme: {{ (theme$ | async) || 'light' }}
      </button>
    </div>
  `
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
```

---

## Advanced Patterns

### Using RxJS Operators for Complex Communication

```typescript
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
      { id: 1, title: `Result for "${query}" 1` },
      { id: 2, title: `Result for "${query}" 2` }
    ]);
  }
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
  `
})
export class SearchComponent {
  searchQuery: string = '';
  results$ = this.searchService.searchResults$;
  
  constructor(private searchService: SearchService) {}
  
  onSearch(query: string): void {
    this.searchService.search(query);
  }
}
```

### ViewChild and ViewChildren for Direct Access

```typescript
import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <app-child #child1 />
    <app-child #child2 />
    <app-child #child3 />
    
    <button (click)="callChildMethods()">Call Child Methods</button>
  `
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
  template: `<p>{{ message }}</p>`
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
```

---

## Best Practices

### 1. **Use Input for Read-Only Data**

✅ **Good**:
```typescript
@Input() readonly user: User | null = null;
```

❌ **Avoid**:
```typescript
@Input() user: User | null = null; // Can be mutated
```

### 2. **Unsubscribe from Observables**

✅ **Good**:
```typescript
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
```

### 3. **Use Services for Global State**

✅ **Good**:
```typescript
export class AppStateService {
  private stateSubject = new BehaviorSubject<AppState>(initialState);
  state$ = this.stateSubject.asObservable();
}
```

### 4. **Keep Components Focused**

✅ **Good**: Each component has a single responsibility

❌ **Avoid**: Overloaded components with multiple concerns

### 5. **Use Type Safety**

✅ **Good**:
```typescript
@Input() user: User | null = null;
@Output() userUpdated = new EventEmitter<User>();
```

❌ **Avoid**:
```typescript
@Input() user: any;
@Output() userUpdated = new EventEmitter();
```

### 6. **Async Pipe in Templates**

✅ **Good**:
```typescript
{{ (user$ | async)?.name }}
```

❌ **Avoid**:
```typescript
// Subscribing in component and storing
user: User | null = null;
ngOnInit() {
  this.service.user$.subscribe(u => this.user = u);
}
```

### 7. **Use ChangeDetectionStrategy.OnPush**

```typescript
@Component({
  selector: 'app-optimized-child',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class OptimizedComponent {
  @Input() data: any;
}
```

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
