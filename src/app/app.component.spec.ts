import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should replace todo state when toggling a todo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const originalTodo = {
      id: 1,
      title: 'Parent task',
      status: 'In Progress' as const,
      isCollapsed: false,
      subTodos: [{ id: 1, title: 'Child task', status: 'In Progress' as const }],
    };
    app.todos.set([originalTodo]);

    app.toggleStatusOfTodo({ target: { checked: true } } as unknown as Event, 0);

    expect(app.todos()[0]).not.toBe(originalTodo);
    expect(originalTodo.status).toBe('In Progress');
    expect(app.todos()[0].status).toBe('Complete');
    expect(app.todos()[0].subTodos[0].status).toBe('Complete');
  });

  it('should render checkbox updates without Zone.js', async () => {
    localStorage.setItem('todos', JSON.stringify([{
      id: 1,
      title: 'Parent task',
      status: 'In Progress',
      isCollapsed: false,
      subTodos: [],
    }]));
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    checkbox.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.todos()[0].status).toBe('Complete');
    expect(checkbox.checked).toBeTrue();
    localStorage.removeItem('todos');
  });
});
