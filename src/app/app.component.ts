import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubTodo, Todo } from './custom.interface';

@Component({
    selector: 'app-root',
    imports: [CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {

  colorArr = ['lightcoral', 'lightskyblue', 'lightgreen', 'lightgray', 'violet', '#f1f17e'];
  todos: Todo[] = [];

  ngOnInit(){
    const storedData = localStorage.getItem('todos');
    this.todos = storedData? JSON.parse(storedData) : [];
    console.log(this.todos);
  }

  toggleStatusOfTodo(e: any, index: number){
    // Marking the todo and all subTodos as complete
    if(e.target.checked){
      this.todos[index].status = 'Complete';
      this.todos[index].subTodos.forEach((el: SubTodo) => {
        el.status = "Complete";
      })
    }
    // Marking the todo and all subTodos as in progress
    else if(!e.target.checked){
      this.todos[index].status = 'In Progress';
      this.todos[index].subTodos.forEach((el: SubTodo) => {
        el.status = "In Progress";
      })
    }
    // Storing in localstorage
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  toggleStatusOfSubTodo(e: any, todoIndex: number, subTodoIndex: number){
    if(e.target.checked){
      this.todos[todoIndex].subTodos[subTodoIndex].status = "Complete";
      // If all subTodos are checked, make the parent also as checked.
      this.checkSubTodosAndMarkParentTodo(todoIndex);
    }
    else if(!e.target.checked){
      this.todos[todoIndex].subTodos[subTodoIndex].status = "In Progress";
      // If the parent todo is already complete, then make it incomplete
      if(this.todos[todoIndex].status === "Complete"){
        this.todos[todoIndex].status = "In Progress";
      }
    }
    // Storing in localstorage
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  deleteTodo(todoIndex: number){
    let sure: boolean = confirm('Are you sure you want to delete?');
    if(sure){
      this.todos.splice(todoIndex, 1);
      localStorage.setItem('todos', JSON.stringify(this.todos));  // Saving in localstorage
    }
  }

  deleteSubTodo(todoIndex: number, subTodoIndex: number){
    let sure: boolean = confirm('Are you sure you want to delete?');
    if(sure){
      this.todos[todoIndex].subTodos.splice(subTodoIndex, 1);
      this.checkSubTodosAndMarkParentTodo(todoIndex);
      localStorage.setItem('todos', JSON.stringify(this.todos));  // Saving in localstorage
    }
  }

  // This function is to check if all the sub-todos are completed, then mark the parent also as complete
  checkSubTodosAndMarkParentTodo(todoIndex: number){
    for(let i=0; i<this.todos[todoIndex].subTodos.length; i++){
      if(this.todos[todoIndex].subTodos[i].status === "In Progress"){
        return;
      }
    }
    this.todos[todoIndex].status = "Complete";
  }

  addTodo(){
    let currentTodo = prompt('Enter the Todo Heading: ');
    if(currentTodo?.trim()){  // Only process if user entered something
      let largestId = this.todos[this.todos.length-1]?.id || 0;
      this.todos.push({id: largestId+1, title: currentTodo, status: "In Progress", isCollapsed: false, subTodos: []});
    }
    localStorage.setItem('todos', JSON.stringify(this.todos));  // Saving in localstorage
  }

  toggleCollapse(todoIndex: number){
    this.todos[todoIndex].isCollapsed = !this.todos[todoIndex].isCollapsed;
    localStorage.setItem('todos', JSON.stringify(this.todos));  // Saving in localstorage
  }

  addSubTodo(todoIndex: number){
    let currentSubTodo = prompt('Enter the Task: ');
    if(currentSubTodo?.trim()){  // Only process if user entered something
      let largestId = this.todos[todoIndex].subTodos[this.todos[todoIndex].subTodos.length-1]?.id || 0;
      this.todos[todoIndex].subTodos.push({id: largestId+1, title: currentSubTodo, status: "In Progress"});
      if(this.todos[todoIndex].status === "Complete"){
        this.todos[todoIndex].status = "In Progress";
      }
    }
    localStorage.setItem('todos', JSON.stringify(this.todos));  // Saving in localstorage
  }

  editTodo(todoIndex: number){
    let answer = prompt('Enter new value');
    if(answer){
      this.todos[todoIndex].title = answer;
      localStorage.setItem('todos', JSON.stringify(this.todos));  // Saving in localstorage
    }
  }

  editSubTodo(todoIndex: number, subTodoIndex: number){
    console.log(todoIndex, subTodoIndex);
    let answer = prompt('Enter new value');
    if(answer){
      this.todos[todoIndex].subTodos[subTodoIndex].title = answer;
      localStorage.setItem('todos', JSON.stringify(this.todos));  // Saving in localstorage
    }
  }

}

// npm run build --output-path docs --base-href todo