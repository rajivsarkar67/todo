import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import type { Todo } from './custom.interface';

@Component({
    selector: 'app-root',
    imports: [],
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  readonly colorArr = ['#646fff', 'lightcoral', 'greenyellow', 'lightskyblue', 'lightgray', '#4dffbe', 'violet', '#f1f17e'];
  readonly todos = signal<Todo[]>([]);

  ngOnInit(): void {
    const storedData = localStorage.getItem('todos');
    this.todos.set(storedData ? JSON.parse(storedData) as Todo[] : []);
  }

  toggleStatusOfTodo(event: Event, index: number): void {
    const status: Todo['status'] = (event.target as HTMLInputElement).checked ? 'Complete' : 'In Progress';

    this.updateTodos(todos => todos.map((todo, todoIndex) => todoIndex === index
      ? {
          ...todo,
          status,
          subTodos: todo.subTodos.map(subTodo => ({ ...subTodo, status })),
        }
      : todo));
  }

  toggleStatusOfSubTodo(event: Event, todoIndex: number, subTodoIndex: number): void {
    const status: Todo['status'] = (event.target as HTMLInputElement).checked ? 'Complete' : 'In Progress';

    this.updateTodos(todos => todos.map((todo, index) => {
      if (index !== todoIndex) {
        return todo;
      }

      const subTodos = todo.subTodos.map((subTodo, subIndex) => subIndex === subTodoIndex
        ? { ...subTodo, status }
        : subTodo);
      let todoStatus = todo.status;

      if (status === 'Complete' && subTodos.every(subTodo => subTodo.status === 'Complete')) {
        todoStatus = 'Complete';
      } else if (status === 'In Progress' && todo.status === 'Complete') {
        todoStatus = 'In Progress';
      }

      return { ...todo, status: todoStatus, subTodos };
    }));
  }

  deleteTodo(todoIndex: number): void {
    if (confirm('Are you sure you want to delete?')) {
      this.updateTodos(todos => todos.filter((_, index) => index !== todoIndex));
    }
  }

  deleteSubTodo(todoIndex: number, subTodoIndex: number): void {
    if (confirm('Are you sure you want to delete?')) {
      this.updateTodos(todos => todos.map((todo, index) => {
        if (index !== todoIndex) {
          return todo;
        }

        const subTodos = todo.subTodos.filter((_, subIndex) => subIndex !== subTodoIndex);
        const status = subTodos.every(subTodo => subTodo.status === 'Complete') ? 'Complete' : todo.status;
        return { ...todo, status, subTodos };
      }));
    }
  }

  addTodo(): void {
    const currentTodo = prompt('Enter the Todo Heading: ');
    this.updateTodos(todos => {
      if (!currentTodo?.trim()) {
        return [...todos];
      }

      const largestId = todos[todos.length - 1]?.id ?? 0;
      return [...todos, {
        id: largestId + 1,
        title: currentTodo,
        status: 'In Progress',
        isCollapsed: false,
        subTodos: [],
      }];
    });
  }

  toggleCollapse(todoIndex: number): void {
    this.updateTodos(todos => todos.map((todo, index) => index === todoIndex
      ? { ...todo, isCollapsed: !todo.isCollapsed }
      : todo));
  }

  addSubTodo(todoIndex: number): void {
    const currentSubTodo = prompt('Enter the Task: ');
    this.updateTodos(todos => todos.map((todo, index) => {
      if (index !== todoIndex || !currentSubTodo?.trim()) {
        return todo;
      }

      const largestId = todo.subTodos[todo.subTodos.length - 1]?.id ?? 0;
      return {
        ...todo,
        status: todo.status === 'Complete' ? 'In Progress' : todo.status,
        subTodos: [...todo.subTodos, {
          id: largestId + 1,
          title: currentSubTodo,
          status: 'In Progress',
        }],
      };
    }));
  }

  editTodo(todoIndex: number): void {
    const answer = prompt('Enter new value', this.todos()[todoIndex].title);
    if (!answer) {
      return;
    }

    this.updateTodos(todos => todos.map((todo, index) => index === todoIndex && answer
      ? { ...todo, title: answer }
      : todo));
  }

  editSubTodo(todoIndex: number, subTodoIndex: number): void {
    const answer = prompt('Enter new value', this.todos()[todoIndex].subTodos[subTodoIndex].title);
    if (!answer) {
      return;
    }

    this.updateTodos(todos => todos.map((todo, index) => index === todoIndex && answer
      ? {
          ...todo,
          subTodos: todo.subTodos.map((subTodo, subIndex) => subIndex === subTodoIndex
            ? { ...subTodo, title: answer }
            : subTodo),
        }
      : todo));
  }

  private updateTodos(update: (todos: Todo[]) => Todo[]): void {
    const todos = update(this.todos());
    this.todos.set(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
  }
}
