import{m as d}from"./vendor-gray-matter-vf1yZiCi.js";import{b as p}from"./vendor-buffer-DXMK02ny.js";const m=`---
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
title: "Angular Signal Forms Custom Controls: Building Reusable Inputs with [formField]"
date: "2026-03-15"
summary: "Learn how to build Angular Signal Forms custom controls with FormValueControl and FormCheckboxControl, bind them with [formField], and keep validation in the latest schema-driven Signal Forms API."
tags: ["Angular", "Forms", "Signals", "Validation", "TypeScript", "Web Development"]
---

# Angular Signal Forms Custom Controls: Building Reusable Inputs with [formField]

Custom form controls have always been one of the most valuable Angular patterns. They let you encapsulate rich UI widgets like quantity steppers, toggles, rating inputs, and nested address forms while still integrating with a parent form. Traditionally, that meant implementing \`ControlValueAccessor\`.

But Angular's latest **Signal Forms** API introduces a different model. Instead of \`NG_VALUE_ACCESSOR\`, callback registration, and imperative bridging code, custom controls can now participate in forms through signal-based interfaces like \`FormValueControl\` and \`FormCheckboxControl\`, then bind directly with the \`[formField]\` directive.

If you are building a new signal-first Angular application, this approach is much more natural.

## Important Note

As of **March 15, 2026**, Angular's official docs document Signal Forms under the Angular v21 guides and still describe the API as **experimental**. That makes Signal Forms a strong option for new signal-centric codebases, but not an automatic replacement for existing Reactive Forms applications.

## What Are Signal Forms Custom Controls?

Signal Forms custom controls are Angular components that expose their state using signals instead of the \`ControlValueAccessor\` contract.

In practice, that means:

- **The control value is a signal** - Usually \`value = model(...)\` or \`checked = model(...)\`
- **Control state is exposed as inputs** - \`disabled\`, \`readonly\`, \`invalid\`, and \`errors\`
- **Touched state is also a signal** - The component can mark itself touched with \`touched.set(true)\`
- **Binding happens with \`[formField]\`** - Angular connects the component to a field in the form tree

This gives you a custom control API that feels consistent with the rest of Angular's signal-based architecture.

## Prerequisites

To follow along, you should have:

- **Angular v21 or higher**
- Basic understanding of **Signals**
- Familiarity with the new **Signal Forms** APIs

## Getting Started with the Latest Signal Forms APIs

Signal Forms custom controls currently revolve around two main interfaces:

- **\`FormValueControl<T>\`** - For value-based controls like text inputs, numeric steppers, and dropdowns
- **\`FormCheckboxControl\`** - For checkbox-like controls driven by a boolean checked state

The binding point is the \`FormField\` directive:

\`\`\`html
<app-seat-stepper [formField]="registrationForm.seats" />
\`\`\`

That single binding replaces the older \`formControlName\` + \`ControlValueAccessor\` integration pattern for Signal Forms.

## Building a Reusable Seat Stepper Control

Let us build a practical example: a workshop registration form with a reusable seat-stepper control. It will:

- Use the latest Signal Forms custom control API
- Bind through \`[formField]\`
- Surface validation errors from the parent form schema
- Respect \`disabled\`, \`readonly\`, and \`touched\` state

### Step 1: Create a Custom \`FormValueControl\`

Here is a standalone seat-stepper component using the latest Signal Forms style:

\`\`\`typescript
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import {
  FormValueControl,
  ValidationError,
  WithOptionalFieldTree,
} from '@angular/forms/signals';

@Component({
  selector: 'app-seat-stepper',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="stepper-card" [class.disabled]="disabled()">
      <label class="stepper-label">{{ label() }}</label>

      <div class="stepper-controls">
        <button
          type="button"
          class="stepper-btn"
          (click)="decrement()"
          [disabled]="disabled() || readonly() || reachedMinimum()"
          aria-label="Decrease seats"
        >
          -
        </button>

        <input
          class="stepper-input"
          type="number"
          [value]="value()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="required()"
          [attr.min]="min() ?? null"
          [attr.max]="max() ?? null"
          [attr.aria-invalid]="invalid()"
          (input)="updateValue($event)"
          (blur)="touched.set(true)"
        />

        <button
          type="button"
          class="stepper-btn"
          (click)="increment()"
          [disabled]="disabled() || readonly() || reachedMaximum()"
          aria-label="Increase seats"
        >
          +
        </button>
      </div>

      @if (invalid() && touched()) {
        <div class="error-box">
          @for (error of errors(); track error.message) {
            <p>{{ error.message }}</p>
          }
        </div>
      }
    </div>
  \`
})
export class SeatStepperComponent implements FormValueControl<number> {
  value = model(1);
  touched = model(false);

  readonly = input(false);
  disabled = input(false);
  invalid = input(false);
  required = input(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  label = input('Seats');
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  step = input(1);

  increment(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const upperBound = this.max() ?? Number.MAX_SAFE_INTEGER;
    this.value.set(Math.min(this.value() + this.step(), upperBound));
    this.touched.set(true);
  }

  decrement(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const lowerBound = this.min() ?? Number.MIN_SAFE_INTEGER;
    this.value.set(Math.max(this.value() - this.step(), lowerBound));
    this.touched.set(true);
  }

  updateValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    const nextValue = input.valueAsNumber;

    if (Number.isNaN(nextValue)) {
      return;
    }

    this.value.set(nextValue);
    this.touched.set(true);
  }

  reachedMinimum(): boolean {
    const min = this.min();
    return min !== undefined && this.value() <= min;
  }

  reachedMaximum(): boolean {
    const max = this.max();
    return max !== undefined && this.value() >= max;
  }
}
\`\`\`

There is no \`ControlValueAccessor\`, no provider registration, and no \`registerOnChange()\` boilerplate. The control participates in the form simply by exposing the expected signal-based contract.

### Step 2: Build a Signal Form Around the Control

Now create a workshop registration form that binds the seat stepper through \`[formField]\`:

\`\`\`typescript
import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  max,
  min,
  required,
  submit,
} from '@angular/forms/signals';
import { SeatStepperComponent } from '../seat-stepper/seat-stepper.component';

interface WorkshopRegistration {
  fullName: string;
  emailAddress: string;
  seats: number;
  company: string;
}

@Component({
  selector: 'app-workshop-registration',
  standalone: true,
  imports: [FormField, JsonPipe, SeatStepperComponent],
  template: \`
    <div class="registration-container">
      <h2>Workshop Registration</h2>

      <form (submit)="onSubmit($event)">
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your name"
            [formField]="registrationForm.fullName"
          />

          @if (registrationForm.fullName().touched() && registrationForm.fullName().invalid()) {
            <div class="error-box">
              @for (error of registrationForm.fullName().errors(); track error.message) {
                <p>{{ error.message }}</p>
              }
            </div>
          }
        </div>

        <div class="form-group">
          <label for="emailAddress">Email Address</label>
          <input
            id="emailAddress"
            type="email"
            placeholder="you@example.com"
            [formField]="registrationForm.emailAddress"
          />

          @if (registrationForm.emailAddress().touched() &&
          registrationForm.emailAddress().invalid()) {
            <div class="error-box">
              @for (error of registrationForm.emailAddress().errors(); track error.message) {
                <p>{{ error.message }}</p>
              }
            </div>
          }
        </div>

        <div class="form-group">
          <label for="company">Company</label>
          <input
            id="company"
            type="text"
            placeholder="Your company"
            [formField]="registrationForm.company"
          />
        </div>

        <div class="form-group">
          <app-seat-stepper
            [formField]="registrationForm.seats"
            [label]="'Number of seats'"
            [step]="1"
          />
        </div>

        <div class="form-summary">
          <h3>Form Status</h3>
          <ul>
            <li>Valid: {{ registrationForm().valid() ? 'Yes' : 'No' }}</li>
            <li>Touched: {{ registrationForm().touched() ? 'Yes' : 'No' }}</li>
            <li>Seats: {{ registrationModel().seats }}</li>
          </ul>
        </div>

        <button type="submit" class="btn-submit">Reserve Seats</button>
      </form>

      <div class="data-preview">
        <h3>Current Model</h3>
        <pre>{{ registrationModel() | json }}</pre>
      </div>
    </div>
  \`,
  styleUrl: './workshop-registration.component.css',
})
export class WorkshopRegistrationComponent {
  registrationModel = signal<WorkshopRegistration>({
    fullName: '',
    emailAddress: '',
    seats: 1,
    company: '',
  });

  registrationForm = form(this.registrationModel, (schema) => {
    required(schema.fullName, {
      message: 'Full name is required',
    });

    required(schema.emailAddress, {
      message: 'Email address is required',
    });
    email(schema.emailAddress, {
      message: 'Enter a valid email address',
    });

    min(schema.seats, 1, {
      message: 'At least one seat is required',
    });
    max(schema.seats, 10, {
      message: 'You can reserve at most 10 seats',
    });
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.registrationForm, async () => {
      const payload = this.registrationModel();
      console.log('Submitting registration:', payload);
    });
  }
}
\`\`\`

The key line is:

\`\`\`html
<app-seat-stepper [formField]="registrationForm.seats" />
\`\`\`

That is the latest Signal Forms equivalent of wiring a custom control into a parent form. Notice that the schema-defined \`min()\` and \`max()\` constraints are passed into the control automatically by \`FormField\`, so the parent template does not need to duplicate them.

### Step 3: Add Styling

Use the following CSS to keep the demo polished and readable:

\`\`\`css
.registration-container {
  max-width: 760px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.registration-container h2,
.registration-container h3 {
  color: #111827;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label,
.stepper-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus,
.stepper-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.stepper-card {
  padding: 1rem;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: #f8fbff;
}

.stepper-card.disabled {
  opacity: 0.6;
}

.stepper-controls {
  display: grid;
  grid-template-columns: 48px 1fr 48px;
  gap: 0.75rem;
  align-items: center;
}

.stepper-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;
  font-size: 1.25rem;
  cursor: pointer;
}

.stepper-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.stepper-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
}

.error-box {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
}

.error-box p {
  margin: 0.25rem 0;
}

.form-summary,
.data-preview {
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f9fafb;
}

.form-summary ul {
  margin: 0.75rem 0 0 0;
  padding-left: 1.25rem;
}

.btn-submit {
  margin-top: 1.5rem;
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #111827;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
}
\`\`\`

## Key Concepts Explained

### 1. \`FormValueControl<T>\` Replaces \`ControlValueAccessor\` for Signal Forms

In classic Angular forms, custom controls bridge themselves to the form system with:

- \`writeValue()\`
- \`registerOnChange()\`
- \`registerOnTouched()\`
- \`NG_VALUE_ACCESSOR\`

In Signal Forms, that bridge becomes much simpler:

\`\`\`typescript
export class SeatStepperComponent implements FormValueControl<number> {
  value = model(1);
  touched = model(false);

  disabled = input(false);
  readonly = input(false);
  invalid = input(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
\`\`\`

That is the core mental shift: the form connects to your control through signals, not callbacks.

### 2. \`[formField]\` Is the New Binding Mechanism

Signal Forms do not use \`formControlName\` or \`ngModel\` for these examples. Instead, the field itself is bound directly:

\`\`\`html
<input [formField]="registrationForm.fullName" />
<app-seat-stepper [formField]="registrationForm.seats" />
\`\`\`

The same directive works for both native elements and custom controls, which makes form templates much more consistent.

### 3. Validation Lives in the Form Schema

One of the biggest improvements in Signal Forms is that validation remains centered in the schema:

\`\`\`typescript
registrationForm = form(this.registrationModel, (schema) => {
  required(schema.fullName, { message: 'Full name is required' });
  email(schema.emailAddress, { message: 'Enter a valid email address' });
  min(schema.seats, 1, { message: 'At least one seat is required' });
  max(schema.seats, 10, { message: 'You can reserve at most 10 seats' });
});
\`\`\`

This keeps the parent form as the source of truth for business rules, while the custom control stays focused on presentation and interaction.

### 4. Touched State Is Explicit

The control decides when user interaction should mark the field as touched:

\`\`\`typescript
(blur)="touched.set(true)"
\`\`\`

or:

\`\`\`typescript
this.touched.set(true);
\`\`\`

That is a lot easier to reason about than manually coordinating \`onTouched()\` callbacks.

### 5. Error Rendering Uses the Field Tree

The custom control can render errors directly from the bound field state:

\`\`\`typescript
errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
\`\`\`

Then in the template:

\`\`\`html
@if (invalid() && touched()) {
  @for (error of errors(); track error.message) {
    <p>{{ error.message }}</p>
  }
}
\`\`\`

This lets the parent own validation while the child owns the presentation of those errors.

## Advanced Features

### Checkbox-style Controls Use \`FormCheckboxControl\`

If your control represents a boolean checked state instead of a generic value, use \`FormCheckboxControl\`:

\`\`\`typescript
import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormCheckboxControl } from '@angular/forms/signals';

@Component({
  selector: 'app-terms-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <button
      type="button"
      class="toggle"
      [class.on]="checked()"
      [disabled]="disabled() || readonly()"
      (click)="toggle()"
    >
      {{ checked() ? 'Accepted' : 'Accept Terms' }}
    </button>
  \`,
})
export class TermsToggleComponent implements FormCheckboxControl {
  checked = model(false);
  touched = model(false);

  readonly = input(false);
  disabled = input(false);

  toggle(): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    this.checked.set(!this.checked());
    this.touched.set(true);
  }
}
\`\`\`

The important distinction is that checkbox-like controls expose \`checked\`, not \`value\`.

### Transform Display Values with \`linkedSignal\`

One of the most useful patterns in the official guide is transforming the display value while keeping the underlying form value clean. For example, you can expose a numeric model but format it as currency:

\`\`\`typescript
import { ChangeDetectionStrategy, Component, linkedSignal, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-budget-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <input [value]="formattedBudget()" (input)="onInput($event)" />
  \`,
})
export class BudgetInputComponent implements FormValueControl<number> {
  value = model(0);
  touched = model(false);

  formattedBudget = linkedSignal(() => \`$\${this.value().toFixed(2)}\`);

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/[^0-9.]/g, '');
    const parsed = Number(raw);

    if (!Number.isNaN(parsed)) {
      this.value.set(parsed);
      this.touched.set(true);
    }
  }
}
\`\`\`

This is much cleaner than mixing parsing and formatting logic into the parent form.

### Mix Native Controls and Custom Controls in the Same Form

Signal Forms make this especially clean because both use the same binding directive:

\`\`\`html
<input [formField]="registrationForm.fullName" />
<input [formField]="registrationForm.emailAddress" />
<app-seat-stepper [formField]="registrationForm.seats" />
\`\`\`

That consistency is one of the strongest advantages of the new API.

## Best Practices

### 1. Keep Business Validation in the Schema

Prefer this:

\`\`\`typescript
min(schema.seats, 1, { message: 'At least one seat is required' });
max(schema.seats, 10, { message: 'You can reserve at most 10 seats' });
\`\`\`

Instead of scattering business rules across multiple components.

### 2. Keep the Control Focused on UI Behavior

The custom control should usually own:

- How the value is displayed
- How interaction changes the value
- When touched state is set
- How field errors are rendered

It should usually not own the full business validation story.

### 3. Implement the Correct Interface for the Control Type

Use:

- \`FormValueControl<T>\` for value-driven controls
- \`FormCheckboxControl\` for checkbox-like controls

Picking the wrong interface creates unnecessary friction in both the component API and the template.

### 4. Respect \`disabled()\` and \`readonly()\`

A good custom control should feel native inside the form. That means every interaction path should guard against disabled and read-only states:

\`\`\`typescript
if (this.disabled() || this.readonly()) {
  return;
}
\`\`\`

### 5. Use Signal Forms Only Where the Tradeoff Makes Sense

Signal Forms are compelling, but the experimental status still matters. For an established Reactive Forms codebase, rewriting everything to the new API is rarely justified.

## Comparison: \`ControlValueAccessor\` vs Signal Forms Custom Controls

| Feature | \`ControlValueAccessor\` | Signal Forms Custom Controls |
|---------|------------------------|------------------------------|
| Primary binding | \`formControlName\` / \`ngModel\` | \`[formField]\` |
| Integration style | Callback-based | Signal-based |
| Registration | \`NG_VALUE_ACCESSOR\` provider | Implement control interface |
| Touched handling | \`registerOnTouched()\` callback | \`touched = model(false)\` |
| Validation flow | Validators + CVA patterns | Schema-driven field validation |
| Best fit | Existing Reactive Forms apps | New signal-first Angular apps |
| Stability | Mature | Experimental as of Angular v21 |

## When to Use Signal Forms Custom Controls

**Use them when:**

- You are building a new Angular v21+ application
- Your form architecture is already signal-first
- You want validation centralized in a schema
- You prefer signal-based state over callback-driven bridging
- You want a consistent \`[formField]\` story for native and custom inputs

**Avoid them when:**

- Your application is already built around Reactive Forms
- Stability matters more than API modernity
- Your team is not ready to adopt experimental Angular APIs
- You need seamless compatibility with existing \`ControlValueAccessor\`-based component libraries

## Conclusion

Angular's latest Signal Forms API makes custom form controls significantly cleaner than the traditional \`ControlValueAccessor\` model. Instead of registering callbacks and providers, you expose value and state through signals, bind with \`[formField]\`, and let the parent schema remain the source of truth for validation.

For new Angular applications, that results in a much more coherent mental model. The seat-stepper example here is simple, but the same pattern scales to toggles, ratings, date inputs, nested object editors, and other reusable form widgets. The main caveat is still the same one documented by Angular today: Signal Forms are powerful, but they remain experimental.

## Resources

- [Angular Signal Forms Custom Controls Guide](https://angular.dev/guide/forms/signals/custom-controls)
- [Angular Signal Forms Overview](https://angular.dev/guide/forms/signals/overview)
- [Angular Signal Forms Validation Guide](https://angular.dev/guide/forms/signals/validation)
- [Angular University: Angular Custom Form Controls](https://blog.angular-university.io/angular-custom-form-controls/)

---

*If you have been building Angular custom controls with \`ControlValueAccessor\`, Signal Forms are worth studying now even if you do not adopt them immediately. The API direction is much clearer for signal-first applications.*
`,g=`---
title: "Angular Deferrable Views: Optimizing Bundle Size with @defer Blocks"
date: "2026-01-26"
summary: "Master Angular's @defer blocks to intelligently defer non-critical code, improve Core Web Vitals, and create lightning-fast applications with granular control over lazy loading."
tags: ["Angular", "Performance", "Optimization", "Web Vitals", "TypeScript", "Web Development"]
---

# Angular Deferrable Views: Optimizing Bundle Size with @defer Blocks

In today's web landscape, performance is paramount. Users expect applications to load instantly, and search engines reward fast-loading sites. However, shipping entire applications upfront can lead to bloated bundles and slow initial loads. Enter **Deferrable Views** – Angular's declarative approach to lazy loading that allows you to defer non-critical code until it's truly needed.

With the \`@defer\` block, you can reduce your initial bundle size, improve Core Web Vitals (especially Largest Contentful Paint and Time to First Byte), and create a more responsive user experience.

## What Are Deferrable Views?

Deferrable views, also known as \`@defer\` blocks, allow you to declaratively defer the loading of components, directives, and pipes that aren't necessary for the initial page render. Instead of bundling all your code together, Angular splits deferred dependencies into separate JavaScript chunks that load only when needed.

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

The simplest \`@defer\` block requires just wrapping your content:

\`\`\`typescript
@defer {
  <large-component />
}
\`\`\`

By default, the deferred content loads when the browser reaches an idle state. However, \`@defer\` blocks become powerful when combined with triggers and state blocks.

## Building a Feature-Rich Product Dashboard

Let's build a practical example: a product dashboard that displays product listings, analytics charts, and recommendation widgets – all with intelligent lazy loading.

> 💻 **[Complete Working Example on GitHub](https://github.com/devendramilmile121/angular-defer-demo)** - Clone and run the full application with all the code from this tutorial!

### Step 1: Set Up the Component

Create a dashboard component that manages the overall structure and product data:

\`\`\`typescript
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
  template: \`\`,
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
\`\`\`

### Step 2: Create Child Components

Create the components that will be deferred:

**Product List Component:**

\`src/app/product-list/product-list.component.ts\`:
\`\`\`typescript
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
\`\`\`

\`src/app/product-list/product-list.component.html\`:
\`\`\`html
<div class="products-grid">
  @for (product of products(); track product.id) {
    <div class="product-card">
      <h3>{{ product.name }}</h3>
      <p class="category">{{ product.category }}</p>
      <p class="price">\${{ product.price }}</p>
      <button class="btn-add">Add to Cart</button>
    </div>
  }
</div>
\`\`\`

**Analytics Chart Component:**

\`src/app/analytics-chart/analytics-chart.component.ts\`:
\`\`\`typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics-chart',
  standalone: true,
  templateUrl: './analytics-chart.component.html',
  styleUrl: './analytics-chart.component.css',
})
export class AnalyticsChartComponent {}
\`\`\`

\`src/app/analytics-chart/analytics-chart.component.html\`:
\`\`\`html
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
\`\`\`

**Recommendations Component:**

\`\`\`typescript
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="recommendations">
      <h3>Recommended for You</h3>
      @for (item of recommendations(); track item.id) {
        <div class="recommendation-item">
          <p>{{ item.text }}</p>
          <small>Based on your browsing history</small>
        </div>
      }
    </div>
  \`,
  styleUrl: './recommendations.component.css',
})
export class RecommendationsComponent {
  recommendations = signal([
    { id: 1, text: 'Premium USB-C Hub - Perfect match for your setup' },
    { id: 2, text: 'Ergonomic Mouse Pad - Complements your keyboard' },
    { id: 3, text: 'Monitor Light Bar - Reduces eye strain' },
  ]);
}
\`\`\`

### Step 3: Build the Template with @defer Blocks

Now let's create the main dashboard template with strategic use of \`@defer\` blocks:

\`\`\`typescript
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
  template: \`
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
  \`,
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
\`\`\`

### Step 4: Add Styling

Create professional styles for the dashboard:

\`\`\`css
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
\`\`\`

## Key Concepts Explained

### 1. Which Dependencies Get Deferred?

For code to be deferred, dependencies must meet two conditions:

- **Must be standalone** - Components, directives, and pipes in \`@defer\` blocks must be declared as standalone
- **Cannot be referenced outside** - The dependency cannot be imported or used elsewhere in the same component template

\`\`\`typescript
// ✅ Good - Can be deferred
@Component({
  selector: 'app-chart',
  standalone: true,
  template: \`...\`
})
export class ChartComponent {}

// ❌ Cannot be deferred if used elsewhere
@Component({
  selector: 'app-shared',
  template: \`...\`
})
export class SharedComponent {}
\`\`\`

### 2. Understanding State Blocks

\`@defer\` blocks support multiple sub-blocks to manage the loading lifecycle:

- **\`@placeholder\`** - Content shown before loading triggers (eagerly loaded)
- **\`@loading\`** - Content shown while resources are being fetched
- **\`@error\`** - Content shown if loading fails

\`\`\`typescript
@defer (on viewport) {
  <large-component />
} @placeholder {
  <div>Placeholder content</div>
} @loading (after 200ms; minimum 1s) {
  <div>Loading...</div>
} @error {
  <div>Failed to load</div>
}
\`\`\`

### 3. Triggers - The Power of Control

Triggers determine when deferred content loads. Angular offers six built-in triggers and support for custom conditions:

**Event-based triggers:**
- \`idle\` - Load when browser is idle (default)
- \`viewport\` - Load when element enters viewport
- \`interaction\` - Load on click or keydown
- \`hover\` - Load on mouse hover

**Time-based triggers:**
- \`timer(duration)\` - Load after specified duration
- \`immediate\` - Load right after non-deferred content

**Conditional trigger:**
- \`when condition\` - Load when condition becomes truthy

### 4. Prefetching Strategy

Prefetching loads resources before they're needed, improving perceived performance:

\`\`\`typescript
@defer (on interaction; prefetch on idle) {
  <large-component />
}
\`\`\`

This prefetches while idle but only displays when user interacts – best of both worlds!

## Advanced Features

### Combining Multiple Triggers

Use semicolons to combine triggers (OR logic):

\`\`\`typescript
@defer (on viewport; on interaction) {
  <lazy-component />
}
\`\`\`

### IntersectionObserver Customization

Fine-tune viewport detection with observer options:

\`\`\`typescript
<div #triggerElement></div>

@defer (on viewport({
  trigger: triggerElement, 
  rootMargin: '100px', 
  threshold: 0.5
})) {
  <lazy-component />
}
\`\`\`

### Preventing Content Flicker

Use timing parameters to prevent rapid state transitions:

\`\`\`typescript
@defer (on viewport) {
  <large-cmp />
} @loading (after 200ms; minimum 500ms) {
  <div>Loading...</div>
} @placeholder (minimum 300ms) {
  <div>Placeholder</div>
}
\`\`\`

### Custom Conditional Loading

Load content based on your application state:

\`\`\`typescript
@defer (when isUserLoggedIn() && hasAccessToken()) {
  <premium-feature />
}
\`\`\`

## Best Practices

### 1. Avoid Cascading Nested @defer Blocks

\`\`\`typescript
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
\`\`\`

### 2. Avoid Layout Shifts

Don't defer components visible on initial load:

\`\`\`typescript
// ❌ Bad - Component is above the fold
@defer (on immediate) {
  <hero-section />  // Visible on load!
}

// ✅ Good - Defer below-the-fold content
@defer (on viewport) {
  <footer-section />
}
\`\`\`

### 3. Plan Placeholder Dimensions

Minimize Cumulative Layout Shift (CLS) with sized placeholders:

\`\`\`html
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
\`\`\`

### 4. Accessibility First

Ensure screen readers are aware of deferred content changes:

\`\`\`html
<div aria-live="polite" aria-atomic="true">
  @defer (on viewport) {
    <product-details />
  } @placeholder {
    Loading product information...
  }
</div>
\`\`\`

### 5. Test Defer Behavior

Angular provides testing utilities for \`@defer\` blocks:

\`\`\`typescript
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
\`\`\`

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

Angular's \`@defer\` blocks represent a significant evolution in how we approach performance optimization. By moving from an all-or-nothing approach to intelligent, trigger-based code loading, developers can create applications that feel faster and more responsive.

The beauty of \`@defer\` lies in its simplicity – a single declarative syntax handles code splitting, prefetching, state management, and error handling. Whether you're deferring analytics charts, recommendation engines, or premium features, \`@defer\` gives you the tools to optimize your bundle size and improve the user experience.

As you build your next Angular application, think strategically about which components can be deferred. Your users will appreciate the faster load times, and your Core Web Vitals scores will thank you.

## Resources

- [Complete Working Example on GitHub](https://github.com/devendramilmile121/angular-defer-demo) - Full source code with all examples
- [Angular Deferrable Views Documentation](https://angular.dev/guide/defer)
- [Bundle Analysis Best Practices](https://angular.dev/guide/bundling-code-splitting)
- [Core Web Vitals Guide](https://web.dev/vitals/)
- [Angular Performance Optimization](https://angular.dev/guide/performance-best-practices)

---

*Have you used @defer blocks in your Angular applications? Share your performance improvements and innovative trigger strategies in the comments below!*
`,h=`---
title: "Angular Injection Tokens: Master Dependency Injection with Custom Tokens"
date: "2026-04-02"
summary: "Unlock the full power of Angular's dependency injection system. Learn how to create custom InjectionTokens for configuration, features toggles, and complex dependencies—turning your loosely-coupled architecture into pure gold."
tags: ["Angular", "Dependency Injection", "TypeScript", "Architecture", "Design Patterns", "Advanced"]
---

# Angular Injection Tokens: Master Dependency Injection with Custom Tokens

Dependency injection is one of Angular's most powerful features, yet many developers underutilize it. While injecting services through constructors feels natural, there's a deeper layer that transforms how you architect applications: **Injection Tokens**.

If you've ever wondered how to inject configuration objects, feature flags, or non-class dependencies, wondered how Angular magically provides \`DOCUMENT\` or \`LOCALE_ID\` without explicit class definitions, or hit a wall trying to inject primitive values—this guide reveals the elegant solution.

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

\`\`\`typescript
constructor(private coffeeService: CoffeeService) {}
\`\`\`

The \`CoffeeService\` class serves as both the token and the provider. Simple, elegant.

But what happens when you need to inject something that isn't a class?

\`\`\`typescript
// ❌ What token do we use for a string?
constructor(private appName: string) {}

// ❌ How do we differentiate between multiple strings?
constructor(private appName: string, private version: string) {}

// ❌ What about configuration objects?
constructor(private config: { apiUrl: string; timeout: number }) {}
\`\`\`

This is where **Injection Tokens** solve the problem. They provide explicit, semantic tokens for any type of dependency.

## Key Concepts Explained

### 1. Understanding the Injector Hierarchy

Angular's dependency injection system operates in a hierarchy. Each component has its own injector context, creating a tree structure from root to leaf components.

\`\`\`
Root Injector (Application Level)
├── Module A Injector
│   ├── Component 1
│   └── Component 2
├── Module B Injector
│   └── Component 3
└── Lazy Loaded Module Injector
    └── Component 4
\`\`\`

When a component requests a dependency, Angular searches up the injector hierarchy:
1. Check the component's own providers
2. Check the parent component's providers
3. Continue up to module providers
4. Reach the root injector

This hierarchical approach enables powerful patterns like feature-specific configurations and scope-limited overrides.

### 2. Class Tokens vs. Injection Tokens

**Class Tokens** use the class itself as the token:

\`\`\`typescript
providers: [CoffeeService]

// Equivalent to:
providers: [{ provide: CoffeeService, useClass: CoffeeService }]

// Inject with:
constructor(private coffee: CoffeeService) {}
\`\`\`

**Injection Tokens** are explicit token objects created for any dependency:

\`\`\`typescript
const COFFEE_SERVICE = new InjectionToken<CoffeeService>('coffee-service');

providers: [{ provide: COFFEE_SERVICE, useClass: CoffeeService }]

// Inject with:
constructor(@Inject(COFFEE_SERVICE) private coffee: CoffeeService) {}
\`\`\`

### 3. Types of Injection Tokens

Angular provides \`InjectionToken\` for creating custom tokens, but also supports different provider strategies:

- **useClass** - Provide an instance of the specified class
- **useValue** - Provide a constant value
- **useFactory** - Provide using a factory function
- **useExisting** - Use an existing token (aliasing)

## Getting Started with Injection Tokens

### Basic Syntax

Create an injection token with \`InjectionToken\`:

\`\`\`typescript
import { InjectionToken } from '@angular/core';

export const API_URL = new InjectionToken<string>('api-url');
\`\`\`

Provide it:

\`\`\`typescript
providers: [
  { provide: API_URL, useValue: 'https://api.example.com' }
]
\`\`\`

Inject it:

\`\`\`typescript
import { Inject } from '@angular/core';

constructor(@Inject(API_URL) private apiUrl: string) {}
\`\`\`

That's it! You've mastered the basics. Now let's explore practical applications.

## Building a Real-World Application Configuration System

Let's build a comprehensive example: a multi-tenant SaaS dashboard with environment-specific configuration, feature toggles, and dynamic API endpoints—all managed through Injection Tokens.

> 💻 **[Complete Working Example on GitHub](https://github.com/devendramilmile121/angular-injection-tokens-demo)** - Clone and run the full application with all the code from this tutorial!

### Step 1: Define Your Configuration Tokens

Create a configuration module that defines all your application tokens:

\`\`\`typescript
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
\`\`\`

### Step 2: Create Environment-Specific Configurations

Define different configurations for development, staging, and production:

\`\`\`typescript
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
\`\`\`

\`\`\`typescript
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
\`\`\`

### Step 3: Create a Configuration Service

Build a service that manages token injection and provides configuration state:

\`\`\`typescript
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
\`\`\`

### Step 4: Set Up Application Providers

Configure your application with environment-specific tokens:

\`\`\`typescript
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
\`\`\`

### Step 5: Create Components That Use Configuration

Build components that consume the injected configuration:

\`\`\`typescript
// src/app/dashboard/dashboard.component.ts
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppConfigService } from '../config/app-config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: \`
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
  \`,
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
\`\`\`

### Step 6: Add Professional Styling

Create CSS for a polished dashboard:

\`\`\`css
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
\`\`\`

### Step 7: Advanced Pattern - Factory Functions

For more complex dependency creation, use factory functions:

\`\`\`typescript
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
\`\`\`

### Step 8: Using Tokens in Services

Services can also consume injection tokens:

\`\`\`typescript
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
    const url = \`\${this.config.apiUrl}/\${endpoint}\`;
    return this.http.get<T>(url).toPromise().then(data => data as T);
  }

  get retryAttempts(): number {
    return this.interceptorConfig.retryAttempts;
  }
}
\`\`\`

## Advanced Injection Patterns

### 1. Multi-Value Tokens

Provide multiple implementations of the same token:

\`\`\`typescript
const PLUGIN = new InjectionToken<Plugin>('plugin');

providers: [
  { provide: PLUGIN, useValue: new AnalyticsPlugin(), multi: true },
  { provide: PLUGIN, useValue: new LoggingPlugin(), multi: true },
  { provide: PLUGIN, useValue: new ErrorTrackingPlugin(), multi: true },
]

// Inject all plugins:
constructor(@Inject(PLUGIN) private plugins: Plugin[]) {}
\`\`\`

### 2. Token Aliasing

Reference one token using another:

\`\`\`typescript
const OLD_API_URL = new InjectionToken<string>('old-api-url');
const API_URL = new InjectionToken<string>('api-url');

providers: [
  { provide: API_URL, useValue: 'https://api.example.com' },
  { provide: OLD_API_URL, useExisting: API_URL }, // Alias
]
\`\`\`

### 3. Conditional Providers

Use factory functions with conditions:

\`\`\`typescript
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
\`\`\`

### 4. Optional Dependencies

Mark dependencies as optional with \`@Optional()\`:

\`\`\`typescript
import { Optional, Inject } from '@angular/core';

constructor(
  @Optional() @Inject(ANALYTICS_TOKEN) private analytics?: AnalyticsService
) {
  if (this.analytics) {
    this.analytics.trackEvent('component-initialized');
  }
}
\`\`\`

## Best Practices

### ✅ Do's

**1. Use Semantic Token Names**

\`\`\`typescript
// ✅ Good - Clear intent
export const API_BASE_URL = new InjectionToken<string>('api-base-url');
export const API_TIMEOUT = new InjectionToken<number>('api-timeout');
export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('feature-flags');

// ❌ Bad - Unclear purpose
export const CONFIG = new InjectionToken<any>('config');
export const DATA = new InjectionToken<any>('data');
\`\`\`

**2. Type Your Tokens Generically**

\`\`\`typescript
// ✅ Good - Type-safe
export const USER_PREFERENCES = new InjectionToken<UserPreferences>('user-prefs');

// ❌ Bad - Loses type information
export const USER_PREFERENCES = new InjectionToken('user-prefs');
\`\`\`

**3. Document Complex Tokens**

\`\`\`typescript
/**
 * Feature flags token for toggling experimental features.
 * Used across the application to conditionally enable/disable functionality.
 *
 * @example
 * constructor(@Inject(FEATURE_FLAGS) private flags: FeatureFlags) {}
 */
export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('feature-flags');
\`\`\`

**4. Group Related Tokens**

\`\`\`typescript
// ✅ Good - Organized in a module
export namespace ApiConfig {
  export const BASE_URL = new InjectionToken<string>('api-base-url');
  export const TIMEOUT = new InjectionToken<number>('api-timeout');
  export const RETRY_ATTEMPTS = new InjectionToken<number>('api-retry-attempts');
}
\`\`\`

### ❌ Don'ts

**1. Don't Mix Class and Injection Tokens**

\`\`\`typescript
// ❌ Bad - Inconsistent patterns
providers: [
  CoffeeService,
  { provide: TEA_SERVICE, useClass: TeaService }
]
\`\`\`

**2. Don't Create Tokens Without Purpose**

\`\`\`typescript
// ❌ Bad - Unnecessary indirection
export const STRING_VALUE = new InjectionToken<string>('string-value');
providers: [{ provide: STRING_VALUE, useValue: 'hello' }]

// Use direct class injection or values when possible
\`\`\`

**3. Don't Inject Deeply Nested Objects**

\`\`\`typescript
// ❌ Bad - Brittle, hard to test
export const ENTIRE_CONFIG = new InjectionToken<any>('config');

// ✅ Good - Granular tokens
export const API_URL = new InjectionToken<string>('api-url');
export const API_TIMEOUT = new InjectionToken<number>('api-timeout');
\`\`\`

**4. Don't Forget @Optional() When Appropriate**

\`\`\`typescript
// ❌ Bad - Crashes if token not provided
constructor(@Inject(ANALYTICS) private analytics: Analytics) {}

// ✅ Good - Gracefully handles missing dependency
constructor(@Optional() @Inject(ANALYTICS) private analytics?: Analytics) {}
\`\`\`

## Testing with Injection Tokens

Tokens make testing exceptionally easy by allowing easy mock replacement:

\`\`\`typescript
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
\`\`\`

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

\`\`\`typescript
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
\`\`\`

### Scenario 2: Feature Flags via API

\`\`\`typescript
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
\`\`\`

### Scenario 3: Plugin System

\`\`\`typescript
export const PLUGINS = new InjectionToken<Plugin[]>('plugins', {
  factory: () => [],
});

providers: [
  { provide: PLUGINS, useValue: new AnalyticsPlugin(), multi: true },
  { provide: PLUGINS, useValue: new CrashReportingPlugin(), multi: true },
]
\`\`\`

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
`,f=`---
title: "Angular Signal Forms: A Modern Approach to Form Management"
date: "2026-01-02"
summary: "Explore Angular Signal Forms - the experimental yet powerful form management system that leverages signals for reactive, type-safe form handling with automatic validation and two-way binding."
tags: ["Angular", "Forms", "Signals", "TypeScript", "Web Development"]
---

# Angular Signal Forms: A Modern Approach to Form Management

Forms are the backbone of user interaction in web applications. Whether it's a simple login form or a complex multi-step wizard, managing form state, validation, and user feedback has always been a challenge. With Angular v21, the framework introduces **Signal Forms** - an experimental yet promising approach to form management that builds on the reactive foundation of signals.

## ⚠️ Important Note

Before we dive in, it's crucial to understand that **Signal Forms are experimental**. The API may change in future releases, and it's not recommended for production applications unless you understand the risks. However, for new applications built with signals, Signal Forms offer a glimpse into the future of Angular form management.

## What Are Signal Forms?

Signal Forms address the traditional challenges of form management by:

- **Synchronizing state automatically** - Automatically sync the form data model with bound form fields
- **Providing type safety** - Support fully type-safe schemas & bindings between UI controls and data model
- **Centralizing validation logic** - Define all validation rules in one place using a validation schema

Unlike Template-driven Forms or Reactive Forms, Signal Forms are model-driven. The form's structure and state are derived directly from a signal-based model, making the entire system more reactive and easier to reason about.

## Prerequisites

To use Signal Forms, you need:
- **Angular v21 or higher**
- Understanding of Angular Signals

## Getting Started with Signal Forms

### Setup

Signal Forms are already included in the \`@angular/forms\` package. You just need to import the necessary functions and directives:

\`\`\`typescript
import { form, Field, required, email } from '@angular/forms/signals';
\`\`\`

The \`Field\` directive must be imported into any component that binds form fields to HTML inputs.

## Building a User Registration Form

Let's build a practical example: a user registration form that collects name, email, and an array of skills.

> 💻 **[Complete Working Example on GitHub](https://github.com/devendramilmile121/angular-signal-froms)** - Clone and run the full application with all the code from this tutorial!

### Step 1: Define the Form Model

Form models are the foundation of Signal Forms. They serve as the single source of truth for your form data.

\`\`\`typescript
import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { applyEach, email, Field, form, minLength, required } from '@angular/forms/signals';

interface Skill {
  name: string;
  proficiency: string;
}

interface UserRegistrationData {
  name: string;
  email: string;
  skills: Skill[];
}

@Component({
  selector: 'app-root',
  imports: [Field, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Create the form model with initial values
  registrationModel = signal<UserRegistrationData>({
    name: '',
    email: '',
    skills: [{ name: '', proficiency: 'beginner' }],
  });

  // Create the form with validation schema
  registrationForm = form(this.registrationModel, (schemaPath) => {
    // Validate name
    required(schemaPath.name, {
      message: 'Name is required',
    });
    minLength(schemaPath.name, 2, {
      message: 'Name must be at least 2 characters',
    });

    // Validate email
    required(schemaPath.email, {
      message: 'Email is required',
    });
    email(schemaPath.email, {
      message: 'Please enter a valid email address',
    });

    // Validate each skill in the array
    applyEach(schemaPath.skills, (skill) => {
      required(skill.name, {
        message: 'Skill name is required',
      });
      required(skill.proficiency, {
        message: 'Proficiency level is required',
      });
    });
  });

  // Add a new skill
  addSkill() {
    this.registrationForm.skills().value.update((skills) => [
      ...skills,
      { name: '', proficiency: 'beginner' },
    ]);
  }

  // Remove a skill
  removeSkill(index: number) {
    this.registrationForm.skills().value.update((skills) => skills.filter((_, i) => i !== index));
  }

  // Handle form submission
  async onSubmit(event: Event) {
    event.preventDefault();
    if (this.registrationForm().valid()) {
      const formData = this.registrationForm().value();
      console.log('Form submitted:', formData);

      // Here you would typically send data to your backend
      // await this.userService.register(formData);

      alert('Registration successful!');
    } else {
      alert('Please fix all errors before submitting');
    }
  }
}
\`\`\`

### Step 2: Create the Template

Now let's create a user-friendly template that displays the form:

\`\`\`html
<div class="registration-container">
  <h2>User Registration</h2>

  <form (submit)="onSubmit($event)">
    <!-- Name Field -->
    <div class="form-group">
      <label for="name">Full Name *</label>
      <input
        id="name"
        type="text"
        [field]="registrationForm.name"
        placeholder="Enter your full name"
      />

      @if (registrationForm.name().touched() && registrationForm.name().invalid()) {
      <div class="error-messages">
        @for (error of registrationForm.name().errors(); track error.kind) {
        <span class="error">{{ error.message }}</span>
        }
      </div>
      }
    </div>

    <!-- Email Field -->
    <div class="form-group">
      <label for="email">Email Address *</label>
      <input
        id="email"
        type="email"
        [field]="registrationForm.email"
        placeholder="your.email@example.com"
      />

      @if (registrationForm.email().touched() && registrationForm.email().invalid()) {
      <div class="error-messages">
        @for (error of registrationForm.email().errors(); track error.kind) {
        <span class="error">{{ error.message }}</span>
        }
      </div>
      }
    </div>

    <!-- Skills Array -->
    <div class="form-section">
      <h3>Skills</h3>

      @for (skill of registrationModel().skills; track $index) {
      <div class="skill-item">
        <div class="skill-fields">
          <div class="form-group flex-grow">
            <label [attr.for]="'skill-name-' + $index">Skill Name *</label>
            <input
              [id]="'skill-name-' + $index"
              type="text"
              [field]="registrationForm.skills[$index].name"
              placeholder="e.g., Angular, TypeScript"
            />

            @if (registrationForm.skills[$index].name().touched() &&
            registrationForm.skills[$index].name().invalid()) {
            <div class="error-messages">
              @for (error of registrationForm.skills[$index].name().errors(); track error.kind) {
              <span class="error">{{ error.message }}</span>
              }
            </div>
            }
          </div>

          <div class="form-group">
            <label [attr.for]="'skill-proficiency-' + $index">Proficiency *</label>
            <select
              [id]="'skill-proficiency-' + $index"
              [field]="registrationForm.skills[$index].proficiency"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        @if ($index > 0) {
        <button type="button" class="btn-remove" (click)="removeSkill($index)">Remove</button>
        }
      </div>
      }

      <button type="button" class="btn-secondary" (click)="addSkill()">+ Add Another Skill</button>
    </div>

    <!-- Display Form Summary -->
    <div class="form-summary">
      <h4>Form Status</h4>
      <ul>
        <li>Valid: {{ registrationForm().valid() ? '✅' : '❌' }}</li>
        <li>Touched: {{ registrationForm().touched() ? 'Yes' : 'No' }}</li>
        <li>Dirty: {{ registrationForm().dirty() ? 'Yes' : 'No' }}</li>
      </ul>
    </div>

    <!-- Submit Button -->
    <div class="form-actions">
      <button type="submit" class="btn-primary" [disabled]="!registrationForm().valid()">
        Register
      </button>
    </div>
  </form>

  <!-- Preview of Current Data -->
  <div class="data-preview">
    <h4>Current Form Data</h4>
    <pre>{{ registrationModel() | json }}</pre>
  </div>
</div>
\`\`\`

### Step 3: Add Styling

Let's add some CSS to make our form look professional:

\`\`\`css
.registration-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 1.5rem;
}

h3 {
  color: #555;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
}

.form-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.skill-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.skill-fields {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.flex-grow {
  flex: 1;
}

.error-messages {
  margin-top: 0.25rem;
}

.error {
  display: block;
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.btn-primary,
.btn-secondary,
.btn-remove {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  margin-top: 1rem;
}

.btn-secondary:hover {
  background-color: #545b62;
}

.btn-remove {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
}

.btn-remove:hover {
  background-color: #c82333;
}

.form-actions {
  margin-top: 2rem;
}

.form-summary {
  margin-top: 2rem;
  padding: 1rem;
  background: #e7f3ff;
  border-radius: 4px;
}

.form-summary ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.form-summary li {
  padding: 0.25rem 0;
}

.data-preview {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  overflow-x: auto;
}

.data-preview pre {
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
}
\`\`\`

## Key Concepts Explained

### 1. Form Models vs Domain Models

Signal Forms distinguish between **form models** (representing raw user input in the UI) and **domain models** (representing business logic). This separation allows you to:

- Tailor the form structure to the user experience
- Transform data between representations as needed
- Keep form logic separate from business logic

### 2. Two-Way Data Binding

The \`[field]\` directive creates automatic two-way synchronization:

**User input → Model:**
1. User types in an input element
2. The \`[field]\` directive detects the change
3. Field state updates
4. Model signal updates

**Programmatic update → UI:**
1. Code updates the model with \`set()\` or \`update()\`
2. Model signal notifies subscribers
3. Field state updates
4. The \`[field]\` directive updates the input element

### 3. Validation Schema

Validation rules are defined in a schema function passed to \`form()\`. Key benefits:

- **Centralized** - All validation logic in one place
- **Reactive** - Automatically runs when values change
- **Type-safe** - Full TypeScript support
- **Composable** - Mix built-in and custom validators

### 4. Working with Arrays

Signal Forms handle arrays elegantly with:

- **Dynamic length** - Add/remove items as needed
- **Automatic tracking** - Items maintain state even when reordered
- **Array validation** - Use \`applyEach()\` to validate each item

## Advanced Features

### Cross-Field Validation

Validate fields that depend on each other:

\`\`\`typescript
form(model, (schemaPath) => {
  validate(schemaPath.confirmEmail, ({ value, valueOf }) => {
    if (value() !== valueOf(schemaPath.email)) {
      return { 
        kind: 'emailMismatch', 
        message: 'Emails do not match' 
      };
    }
    return null;
  });
});
\`\`\`

### Async Validation

Check values against a server:

\`\`\`typescript
import { validateHttp } from '@angular/forms/signals';

form(model, (schemaPath) => {
  validateHttp(schemaPath.username, {
    request: ({ value }) => \`/api/check-username?username=\${value()}\`,
    onSuccess: (response) => {
      if (response.taken) {
        return { 
          kind: 'usernameTaken', 
          message: 'Username is already taken' 
        };
      }
      return null;
    },
    onError: () => ({ 
      kind: 'networkError', 
      message: 'Could not verify username' 
    })
  });
});
\`\`\`

### Custom Validators

Create reusable validation rules:

\`\`\`typescript
function strongPassword(field: any, options?: { message?: string }) {
  validate(field, ({ value }) => {
    const password = value();
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    
    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return {
        kind: 'strongPassword',
        message: options?.message || 
          'Password must contain uppercase, lowercase, number, and special character'
      };
    }
    return null;
  });
}
\`\`\`

## Best Practices

### 1. Initialize All Fields

Always provide initial values for every field:

\`\`\`typescript
// ✅ Good
const model = signal({
  name: '',
  email: '',
  age: 0
});

// ❌ Avoid
const model = signal({
  name: ''
  // Missing email and age - won't be in field tree
});
\`\`\`

### 2. Use Specific Types

Define interfaces for better type safety:

\`\`\`typescript
interface UserFormData {
  name: string;
  email: string;
  age: number;
}

const model = signal<UserFormData>({
  name: '',
  email: '',
  age: 0
});
\`\`\`

### 3. Avoid Undefined

Use appropriate empty values instead of \`undefined\`:

\`\`\`typescript
// ✅ Good
interface FormData {
  name: string;
  birthday: Date | null;
}

// ❌ Avoid
interface FormData {
  name?: string;  // Implicitly allows undefined
  birthday?: Date;
}
\`\`\`

### 4. Show Validation at the Right Time

Use \`touched()\` to prevent premature error display:

\`\`\`html
@if (field().touched() && field().invalid()) {
  <div class="errors">
    @for (error of field().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}
\`\`\`

## Comparison with Other Form Systems

| Feature | Signal Forms | Reactive Forms | Template-driven |
|---------|-------------|----------------|-----------------|
| Type Safety | ✅ Full | ✅ Full (with TypeScript) | ❌ Limited |
| Two-way Binding | ✅ Automatic | ⚠️ Manual | ✅ Automatic |
| Validation Schema | ✅ Centralized | ⚠️ Distributed | ⚠️ Distributed |
| Reactive Updates | ✅ Built-in | ✅ RxJS-based | ⚠️ Limited |
| Learning Curve | Medium | Medium | Low |
| Maturity | ⚠️ Experimental | ✅ Stable | ✅ Stable |

## When to Use Signal Forms

**✅ Use Signal Forms when:**
- Building a new application with Angular v21+
- Already using signals throughout your app
- Want automatic synchronization and type safety
- Need centralized validation logic
- Comfortable with experimental features

**❌ Avoid Signal Forms when:**
- Working on production applications requiring stability
- Using Angular versions below v21
- Team is not comfortable with experimental APIs
- Need features from mature form libraries

## Conclusion

Angular Signal Forms represent a modern, reactive approach to form management that aligns perfectly with Angular's signals architecture. While still experimental, they offer powerful features like automatic synchronization, type safety, and centralized validation that make form development more intuitive and maintainable.

The example we built demonstrates how Signal Forms handle common scenarios: simple fields, complex validation, and dynamic arrays. As the API matures and stabilizes, Signal Forms have the potential to become the preferred way to build forms in Angular.

## Resources

- [Complete Working Example on GitHub](https://github.com/devendramilmile121/angular-signal-froms) - Full source code from this tutorial
- [Angular Signal Forms Documentation](https://angular.dev/guide/forms/signals/overview)
- [Signal Forms API Reference](https://angular.dev/api/forms/signals)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Standard Schema Integration](https://standardschema.dev/)

---

*Have you tried Signal Forms in your Angular projects? Share your experiences in the comments below!*
`,b=`---
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
`,v=`---
title: ".NET 10 Server-Sent Events: Real-Time Updates Made Easy"
date: "2026-01-09"
summary: "Learn how to build real-time applications with .NET 10's new Server-Sent Events API. Stream live stock market data to your clients using a simple, efficient approach that's perfect for dashboards, notifications, and live updates."
tags: [".NET", "ASP.NET Core", "Real-Time", "Server-Sent Events", "Web Development", "Stock Market"]
---

# .NET 10 Server-Sent Events: Real-Time Updates Made Easy

Ever wondered how those slick live dashboards update without refreshing the page? Or how notification feeds just magically appear? That's real-time communication at work. And with .NET 10, Microsoft just made it super easy to build these features with Server-Sent Events (SSE).

Let's be real - WebSockets have been the go-to solution for years, but they're often overkill. You don't always need that two-way communication. Sometimes you just want the server to push updates to the client, and that's exactly what Server-Sent Events do best. Think of it like subscribing to a news feed - you sit back and the updates come to you.

## What Are Server-Sent Events?

Here's the cool part: Server-Sent Events let your server push data to the browser over a single HTTP connection. No polling, no constant requests - just a persistent connection where the server sends updates whenever it wants.

Picture this: your server is like a DJ at a radio station, and your client is tuned in. The DJ (server) keeps streaming music (data), and you (client) just listen. You don't need to call the DJ every 5 seconds asking "got anything new?" - they'll broadcast it when they're ready.

In .NET 10, these event messages are represented as \`SseItem<T>\` objects. Each item can have:
- An **event type** (like "heartRate", "notification", "price-update")
- An **ID** (for tracking which events you've received)
- A **data payload** (whatever you want to send - JSON, strings, objects)

## Prerequisites

To follow along, you'll need:
- **.NET 10 SDK** or higher
- Basic understanding of ASP.NET Core
- Your favorite code editor (VS Code, Visual Studio, Rider - whatever floats your boat)

## Why Use Server-Sent Events?

**✅ Perfect for:**
- Live dashboards and monitoring
- Real-time notifications
- Stock tickers and price updates
- Social media feeds
- Progress updates for long-running tasks
- Live sports scores

**❌ Not the right fit for:**
- Two-way chat applications (use WebSockets)
- Binary data streaming
- Situations needing bidirectional communication
- IE11 support (yeah, it's finally time to let go)

## Building a Real-Time Stock Price Ticker

Let's build something practical - a stock price ticker that streams live market data to the browser. This is the kind of thing you'd see in a trading platform or financial dashboard.

> 💻 **[Complete Working Example on GitHub](https://github.com/devendramilmile121/server-sent-events)** - Clone and run the full application with all the code from this tutorial!

### Step 1: Set Up Your ASP.NET Core Project

First, create a new project:

\`\`\`bash
dotnet new web -n StockPriceTicker
cd StockPriceTicker
\`\`\`

### Step 2: Create Your Minimal API Endpoint

Open \`Program.cs\` and let's build our first SSE endpoint. We'll start with a simple stock price stream:

\`\`\`csharp
using System.Runtime.CompilerServices;

var builder = WebApplication.CreateBuilder(args);

// Add services if needed
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();

// Simple string-based stock price stream
app.MapGet("/stocks/simple", (CancellationToken cancellationToken) =>
{
    async IAsyncEnumerable<string> GetStockPrice(
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var basePrice = 150.0m;
        while (!cancellationToken.IsCancellationRequested)
        {
            var change = (decimal)(Random.Shared.NextDouble() * 4 - 2);
            basePrice += change;
            yield return $"AAPL: \${basePrice:F2}";
            await Task.Delay(2000, cancellationToken);
        }
    }

    return TypedResults.ServerSentEvents(GetStockPrice(cancellationToken));
});

app.Run();
\`\`\`

That's it! You've got a working SSE endpoint. Pretty straightforward, right?

### Step 3: Level Up with Typed Data

Sending strings is cool, but let's get fancy with proper typed objects:

\`\`\`csharp
// Define your stock quote record
public record StockQuote(
    string Symbol,
    decimal Price,
    decimal Change,
    decimal ChangePercent,
    long Volume,
    DateTime Timestamp,
    string Trend)
{
    public static StockQuote Create(string symbol, decimal currentPrice, decimal previousPrice)
    {
        var change = currentPrice - previousPrice;
        var changePercent = (change / previousPrice) * 100;
        var trend = change switch
        {
            > 0 => "Up",
            < 0 => "Down",
            _ => "Neutral"
        };

        return new StockQuote(
            symbol,
            currentPrice,
            change,
            changePercent,
            Random.Shared.NextInt64(1000000, 10000000),
            DateTime.UtcNow,
            trend
        );
    }
}

// Add this endpoint to your Program.cs
app.MapGet("/stocks/json", (string symbol = "AAPL", CancellationToken cancellationToken = default) =>
{
    async IAsyncEnumerable<StockQuote> GetStockPrices(
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var currentPrice = 150.0m;
        
        while (!cancellationToken.IsCancellationRequested)
        {
            var previousPrice = currentPrice;
            var change = (decimal)(Random.Shared.NextDouble() * 4 - 2);
            currentPrice += change;
            
            yield return StockQuote.Create(symbol, currentPrice, previousPrice);
            await Task.Delay(2000, cancellationToken);
        }
    }

    return TypedResults.ServerSentEvents(
        GetStockPrices(cancellationToken),
        eventType: "stockPrice"
    );
});
\`\`\`

See that \`eventType: "stockPrice"\` parameter? That's super handy on the client side for filtering different types of events.

### Step 4: Test Your API Endpoint

Fire it up:

\`\`\`bash
dotnet run
\`\`\`

Now you can test your SSE endpoint in several ways:

**Using a Browser:**
Simply navigate to \`https://localhost:5001/stocks/json?symbol=AAPL\` in your browser. You'll see the raw SSE stream with events coming in every 2 seconds.

**Using curl:**
\`\`\`bash
curl -N https://localhost:5001/stocks/json?symbol=AAPL
\`\`\`

The \`-N\` flag disables buffering so you see events as they arrive.

**Using JavaScript EventSource:**
Open your browser's console and run:
\`\`\`javascript
const eventSource = new EventSource('https://localhost:5001/stocks/json?symbol=AAPL');
eventSource.addEventListener('stockPrice', (event) => {
    console.log('Stock update:', JSON.parse(event.data));
});
\`\`\`

You'll see stock price data streaming in real-time!

## Advanced Scenarios

### Multiple Event Types

You can stream different types of events on the same connection:

\`\`\`csharp
app.MapGet("/market/stream", (CancellationToken cancellationToken) =>
{
    async IAsyncEnumerable<SseItem<object>> GetMarketData(
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        var stocks = new Dictionary<string, decimal>
        {
            ["AAPL"] = 150.0m,
            ["GOOGL"] = 140.0m,
            ["MSFT"] = 380.0m
        };

        while (!cancellationToken.IsCancellationRequested)
        {
            foreach (var stock in stocks.Keys.ToList())
            {
                var previousPrice = stocks[stock];
                var change = (decimal)(Random.Shared.NextDouble() * 4 - 2);
                stocks[stock] += change;

                yield return new SseItem<object>(
                    StockQuote.Create(stock, stocks[stock], previousPrice),
                    "stockPrice"
                );

                await Task.Delay(1000, cancellationToken);
            }

            // Send market summary
            yield return new SseItem<object>(
                new { 
                    TotalVolume = Random.Shared.NextInt64(50000000, 100000000),
                    ActiveTraders = Random.Shared.Next(10000, 50000),
                    Timestamp = DateTime.UtcNow
                },
                "marketSummary"
            );

            await Task.Delay(5000, cancellationToken);
        }
    }

    return TypedResults.ServerSentEvents(GetMarketData(cancellationToken));
});
\`\`\`

On the client side, listen for specific event types:

\`\`\`javascript
eventSource.addEventListener('stockPrice', (event) => {
    const data = JSON.parse(event.data);
    console.log('Stock update:', data);
});

eventSource.addEventListener('marketSummary', (event) => {
    const data = JSON.parse(event.data);
    console.log('Market summary:', data);
});
\`\`\`

### Event IDs for Reliability

SSE supports event IDs, which help with reconnection. If your client disconnects, it can tell the server which was the last event it received:

\`\`\`csharp
app.MapGet("/notifications", (CancellationToken cancellationToken, int? lastEventId) =>
{
    async IAsyncEnumerable<SseItem<Notification>> GetNotifications(
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        int currentId = lastEventId ?? 0;

        while (!cancellationToken.IsCancellationRequested)
        {
            currentId++;
            var notification = await GetNextNotification();
            
            yield return new SseItem<Notification>(notification, "notification")
            {
                Id = currentId.ToString()
            };

            await Task.Delay(5000, cancellationToken);
        }
    }

    return TypedResults.ServerSentEvents(GetNotifications(cancellationToken));
});
\`\`\`

The browser automatically sends the \`Last-Event-ID\` header when reconnecting!

### Using Controllers Instead of Minimal APIs

Prefer controllers? No problem:

\`\`\`csharp
[ApiController]
[Route("api/[controller]")]
public class StreamController : ControllerBase
{
    [HttpGet("stocks/{symbol}")]
    public IResult StreamStockPrice(string symbol, CancellationToken cancellationToken)
    {
        async IAsyncEnumerable<StockQuote> GetStockPrice(
            [EnumeratorCancellation] CancellationToken cancellationToken)
        {
            var currentPrice = 150.0m;
            
            while (!cancellationToken.IsCancellationRequested)
            {
                var previousPrice = currentPrice;
                var change = (decimal)(Random.Shared.NextDouble() * 4 - 2);
                currentPrice += change;
                
                yield return StockQuote.Create(symbol, currentPrice, previousPrice);
                await Task.Delay(2000, cancellationToken);
            }
        }

        return TypedResults.ServerSentEvents(
            GetStockPrice(cancellationToken),
            eventType: "stockPrice"
        );
    }
}
\`\`\`

## Key Concepts Explained

### How SSE Actually Works

When a client connects to your SSE endpoint:
1. The server keeps the HTTP connection open
2. It sends data in a special format that browsers understand
3. The connection stays alive until the client disconnects or the server closes it
4. If disconnected, the browser automatically tries to reconnect

The format looks like this over the wire:

\`\`\`
data: {"symbol": "AAPL", "price": 152.45, "change": 1.23, "trend": "Up"}
event: stockPrice
id: 1

data: {"symbol": "AAPL", "price": 151.89, "change": -0.56, "trend": "Down"}
event: stockPrice
id: 2
\`\`\`

### Cancellation Token Magic

Notice that \`CancellationToken\` parameter? That's how .NET knows when the client disconnects. When the browser closes the connection, the token gets cancelled, breaking out of your loop. Clean and automatic!

### IAsyncEnumerable - The Secret Sauce

Using \`IAsyncEnumerable<T>\` with \`yield return\` is what makes this so elegant. You're basically creating an async stream that .NET can consume at its own pace. No buffering headaches, no memory issues - just smooth streaming.

## Performance Tips

### 1. Set Reasonable Delays

Don't blast updates every millisecond. Most UIs can't even refresh that fast:

\`\`\`csharp
await Task.Delay(1000, cancellationToken); // 1 second is often plenty
\`\`\`

### 2. Batch Updates When Possible

Instead of sending 100 tiny events, send one event with an array:

\`\`\`csharp
yield return new SseItem<StockQuote[]>(recentQuotes, "stockBatch");
\`\`\`

### 3. Clean Up Resources

Always respect the cancellation token:

\`\`\`csharp
while (!cancellationToken.IsCancellationRequested)
{
    // Your code
}
// Clean up any resources here
\`\`\`

### 4. Consider Connection Limits

Browsers limit concurrent connections (usually 6 per domain). If you're opening multiple SSE connections, you might hit this limit.

## Comparison: SSE vs WebSockets vs Polling

| Feature | Server-Sent Events | WebSockets | HTTP Polling |
|---------|-------------------|------------|--------------|
| Direction | Server → Client | Bidirectional | Client ↔ Server |
| Protocol | HTTP | WebSocket | HTTP |
| Reconnection | Automatic | Manual | N/A |
| Browser Support | Modern browsers | All modern browsers | Universal |
| Complexity | Low | Medium | Low |
| Overhead | Low | Very Low | High |
| Best For | Live updates, feeds | Chat, gaming | Legacy support |

## Common Pitfalls (And How to Avoid Them)

### 1. Forgetting CORS

If you're calling from a different domain, don't forget CORS:

\`\`\`csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSSE", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
\`\`\`

### 2. Not Handling Disconnections

Always assume the client might disconnect:

\`\`\`csharp
eventSource.onerror = () => {
    console.log('Connection lost, will retry...');
};
\`\`\`

### 3. Sending Too Much Data

Keep payloads small. If you're sending megabytes of data, you're doing it wrong.

### 4. Not Testing Network Issues

Test what happens when the network drops. Does your app recover gracefully?

## When to Choose SSE

**✅ Go with SSE when:**
- You only need server-to-client updates
- You're building dashboards, feeds, or notifications
- You want automatic reconnection
- You don't need to support ancient browsers
- You want something simpler than WebSockets

**🤔 Think twice when:**
- You need client-to-server communication (consider WebSockets)
- You're sending huge amounts of binary data
- You need to support IE11 (seriously, just don't)

## Real-World Use Cases

### Live Dashboard

Perfect for displaying real-time metrics:
- Server stats (CPU, memory, requests/sec)
- Sales numbers
- User activity
- Error rates

### Notification System

Stream notifications as they happen:
- New messages
- System alerts
- Task completions
- Friend requests

### Stock Ticker

Show live market data:
- Price updates
- Volume changes
- Breaking news
- Portfolio values

### Progress Tracking

Monitor long-running operations:
- File uploads
- Report generation
- Batch processing
- Build/deployment status

## Conclusion

Server-Sent Events in .NET 10 are a game-changer for building real-time features. They're simple, efficient, and perfect for when you just need the server to push updates to the client. No complicated protocols, no fancy infrastructure - just straightforward HTTP streaming that works.

The new \`TypedResults.ServerSentEvents\` API makes it dead simple to get started. Whether you're building a live dashboard, a notification system, or a real-time monitoring tool, SSE should definitely be on your radar.

Ready to make your apps more interactive? Give SSE a shot. Your users will love the instant updates, and you'll love how easy it is to implement.

## Resources

- [Complete Working Example on GitHub](https://github.com/devendramilmile121/server-sent-events) - Full source code from this tutorial
- [Server-Sent Events on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Minimal API SSE Sample](https://github.com/dotnet/aspnetcore/tree/main/src/Http/samples/MinimalApiSse)
- [Controller API SSE Sample](https://github.com/dotnet/aspnetcore/tree/main/src/Mvc/samples/ControllerApiSse)
- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core)
- [EventSource API Reference](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)

---

*Built something cool with Server-Sent Events? Drop a comment below and share your experience!*
`,y=`---
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
`,C=`---
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
`,S=`---
title: "YARP Reverse Proxy — What It Is, How to Use It, and When It Matters"
date: "2025-12-09"
summary: "YARP is a reverse proxy library for .NET that handles routing, load balancing, and request transformation. Learn how it works, see practical code examples, and understand what makes it useful and what to watch out for."
tags: ["YARP", "Reverse Proxy", "Load Balancing", ".NET", "API Gateway", "Microservices"]
---

# YARP Reverse Proxy — What It Is, How to Use It, and When It Matters

YARP stands for Yet Another Reverse Proxy. It's a reverse proxy library built on top of .NET that lets you route incoming requests to backend services, transform them, and send responses back to clients.

If you're building microservices, dealing with multiple backend servers, or need to modify requests and responses on the fly, YARP can help. But it's not magic, and it has trade-offs you should know about.

## What Is a Reverse Proxy?

A reverse proxy sits between your clients and your backend servers.

When a request comes in, the reverse proxy decides where to send it. It could go to one backend, many backends, or get modified before it goes anywhere.

This is different from a forward proxy, which sits between clients and the internet. A reverse proxy sits between the internet and your servers.

## Why Use YARP?

### Route requests to multiple backends

You have three API servers running on different ports. YARP can send requests to all three based on rules you define.

### Load balancing

Distribute traffic across servers so no single server gets crushed.

### Transform requests and responses

Modify headers, add authentication, change the request path, remove sensitive data from responses, and more.

### Authentication and authorization

Check tokens, validate permissions, and block bad requests before they hit your backend.

### Centralized place to manage these concerns

Instead of handling routing logic in each microservice, do it in one place.

## Basic Setup

First, create a new ASP.NET Core project and add YARP:

\`\`\`bash
dotnet new web -n YarpProxy
cd YarpProxy
dotnet add package Yarp.ReverseProxy
\`\`\`

Now configure it in your \`Program.cs\`:

\`\`\`csharp
var builder = WebApplication.CreateBuilder(args);

// Add YARP services
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.MapReverseProxy();
app.Run();
\`\`\`

Create an \`appsettings.json\` file with your routes and clusters:

\`\`\`json
{
  "ReverseProxy": {
    "Routes": [
      {
        "RouteId": "api_route",
        "ClusterId": "api_cluster",
        "Match": {
          "Path": "/api/{**catch-all}"
        },
        "Transforms": [
          {
            "PathPattern": "/api/{**catch-all}",
            "PathTransform": "/{**catch-all}"
          }
        ]
      },
      {
        "RouteId": "admin_route",
        "ClusterId": "admin_cluster",
        "Match": {
          "Path": "/admin/{**catch-all}"
        }
      }
    ],
    "Clusters": [
      {
        "ClusterId": "api_cluster",
        "Destinations": {
          "api1": {
            "Address": "http://localhost:5001"
          },
          "api2": {
            "Address": "http://localhost:5002"
          },
          "api3": {
            "Address": "http://localhost:5003"
          }
        }
      },
      {
        "ClusterId": "admin_cluster",
        "Destinations": {
          "admin1": {
            "Address": "http://localhost:6001"
          }
        }
      }
    ]
  }
}
\`\`\`

That's it. Now \`/api/users\` requests go to one of your three API servers. \`/admin/dashboard\` goes to your admin server.

## Transforming Requests and Responses

This is where YARP gets powerful. Transformers let you modify requests before they go to backends and responses before they go to clients.

### Built-in Transformers

YARP has transformers for common tasks:

**Modify the path:**

\`\`\`json
"Transforms": [
  {
    "PathPattern": "/old-path/{**catch-all}",
    "PathTransform": "/new-path/{**catch-all}"
  }
]
\`\`\`

**Add a header:**

\`\`\`json
"Transforms": [
  {
    "RequestHeader": "X-Custom-Header",
    "Set": "CustomValue"
  }
]
\`\`\`

**Remove a header:**

\`\`\`json
"Transforms": [
  {
    "RequestHeaderRemove": "Authorization"
  }
]
\`\`\`

**Change the host:**

\`\`\`json
"Transforms": [
  {
    "RequestHeader": "Host",
    "Set": "backend.internal.com"
  }
]
\`\`\`

### Custom Transformers

For more complex logic, write your own transformer:

\`\`\`csharp
public class AuthHeaderTransformer : HttpRequestTransformer
{
    private readonly ITokenService _tokenService;

    public AuthHeaderTransformer(ITokenService tokenService)
    {
        _tokenService = tokenService;
    }

    public override async ValueTask TransformRequestAsync(HttpRequestTransformContext context)
    {
        var token = await _tokenService.GenerateBackendToken();
        context.ProxyRequest.Headers.Authorization = 
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
    }
}

public class SensitiveDataTransformer : HttpResponseTransformer
{
    public override async ValueTask TransformResponseAsync(HttpResponseTransformContext context)
    {
        if (context.ProxyResponse.Content is not null)
        {
            var content = await context.ProxyResponse.Content.ReadAsStringAsync();
            
            // Remove sensitive fields
            content = content.Replace("\\"ssn\\":", "\\"ssn\\":\\"***\\"");
            content = content.Replace("\\"creditCard\\":", "\\"creditCard\\":\\"****-****-****-****\\"");
            
            context.ProxyResponse.Content = new StringContent(content);
        }
    }
}
\`\`\`

Register your custom transformers:

\`\`\`csharp
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms<AuthHeaderTransformer>()
    .AddTransforms<SensitiveDataTransformer>();
\`\`\`

Use them in your config:

\`\`\`json
{
  "RouteId": "secure_route",
  "ClusterId": "secure_cluster",
  "Match": {
    "Path": "/secure/{**catch-all}"
  },
  "Transforms": [
    {
      "RequestTransformer": "AuthHeaderTransformer"
    },
    {
      "ResponseTransformer": "SensitiveDataTransformer"
    }
  ]
}
\`\`\`

## What's Good About YARP

**Runs on .NET**

If your team uses .NET, you already know the ecosystem. You can handle routing logic in the same language as your backend services.

**Flexible configuration**

Routes and clusters can come from JSON, code, or even be loaded dynamically from a database. You can change routing without restarting if you load from a config source.

**Built for modern microservices**

It handles service discovery, load balancing policies, health checks, and timeouts out of the box.

**Transforms are powerful and composable**

Chain multiple transformers together. Build complex request/response modifications without writing a lot of code.

**Good performance**

YARP is built on top of the same HTTP infrastructure as ASP.NET Core. It doesn't add much overhead.

**Open source and actively maintained**

It's backed by Microsoft and has community support.

## What's Hard About YARP

**Another service to run and maintain**

YARP is another application you have to deploy, monitor, and keep running. If it goes down, your entire API is down.

**Performance becomes a bottleneck**

If YARP itself is slow, every request slows down. You need to monitor and scale it like any other service.

**Transforms can get complex**

Simple transforms are easy. Complex logic with multiple steps, conditional transformations, and error handling gets messy fast. At some point, it's easier to handle it in your backend services.

**Debugging is harder**

When something goes wrong, you're debugging across your reverse proxy and your backend. Logs need to flow through multiple systems.

**Complexity for small projects**

If you have two or three simple backend services, YARP might be overkill. A simple nginx config could do the same thing with less overhead.

**State management is tricky**

YARP is stateless by design. If you need to track something across requests or coordinate between transformers, it gets complicated.

## When to Use YARP

Use YARP when you have:

Multiple backend services that need routing logic

Need to transform requests and responses consistently

Want authentication and authorization in one place

Running a .NET-based microservices architecture

Need load balancing with custom policies

Want something that integrates naturally with ASP.NET Core

Don't use YARP when you:

Have a simple API with one or two backends

Already have nginx or another reverse proxy working well

Want to avoid running another service

Need advanced networking features that nginx has

## Real Example: Adding Authentication

Let's say you want to check a JWT token for every request and block requests with invalid tokens:

\`\`\`csharp
public class TokenValidationTransformer : HttpRequestTransformer
{
    private readonly ITokenValidator _validator;

    public TokenValidationTransformer(ITokenValidator validator)
    {
        _validator = validator;
    }

    public override async ValueTask TransformRequestAsync(HttpRequestTransformContext context)
    {
        var token = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault();

        if (string.IsNullOrEmpty(token))
        {
            context.HttpContext.Response.StatusCode = 401;
            await context.HttpContext.Response.WriteAsJsonAsync(new { error = "No token provided" });
            return;
        }

        var isValid = await _validator.ValidateAsync(token);
        if (!isValid)
        {
            context.HttpContext.Response.StatusCode = 401;
            await context.HttpContext.Response.WriteAsJsonAsync(new { error = "Invalid token" });
            return;
        }

        // Token is valid, continue with the request
    }
}
\`\`\`

Now every request goes through token validation before hitting your backend services. You handle this in one place instead of repeating it in every service.

## Keep It Simple

Start with basic routing. Get that working. Then add transforms as you need them. Don't build a complicated system if you don't need it yet.

YARP is useful because it gives you options. But options mean complexity. Use what you actually need.

## Conclusion

YARP is a solid choice for managing request routing and transformation in .NET microservices. It's flexible, performant, and integrates well with ASP.NET Core.

The trade-off is running another service and keeping transforms maintainable. But if you have multiple backends or complex routing needs, that trade-off usually makes sense.

Start small, add features as you need them, and don't over-engineer it.

## Official Resources

For more detailed information and advanced features, check out the [official Microsoft documentation for YARP Getting Started](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/yarp/getting-started?view=aspnetcore-10.0).

The official docs cover configuration options, advanced transforms, middleware integration, and more.
`;typeof global>"u"&&(window.global=window);window.Buffer=p.Buffer;const w=Object.assign({"../blogs/angular-component-communication.md":m,"../blogs/angular-custom-form-controls.md":u,"../blogs/angular-deferrable-views.md":g,"../blogs/angular-injection-tokens.md":h,"../blogs/angular-signal-forms.md":f,"../blogs/angular-signals.md":b,"../blogs/dotnet-server-sent-events.md":v,"../blogs/getting-started-with-react.md":y,"../blogs/web-performance-optimization.md":C,"../blogs/yarp-reverse-proxy.md":S});let a=null;async function k(){if(a)return a;const n=[];for(const[e,t]of Object.entries(w))try{const i=(e.split("/").pop()||"").replace(".md","").toLowerCase(),s=String(t),{data:l,content:c}=d(s),r=l;n.push({slug:i,title:r.title,date:r.date,summary:r.summary,tags:r.tags||[],body:c})}catch(o){console.error(`[Blogs] Error loading blog ${e}:`,o)}return n.sort((e,t)=>new Date(t.date).getTime()-new Date(e.date).getTime()),a=n,n}async function T(n){return(await k()).find(o=>o.slug===n)}export{T as g,k as l};
