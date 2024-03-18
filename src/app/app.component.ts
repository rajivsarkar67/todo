import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubTodo, Todo } from './custom.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  colorArr = ['lightcoral', 'lightpink', 'lightskyblue', 'gray', 'violet'];
  todos: Todo[] = [];
  // todos : Todo[] = [
  //   {id: 1, title: 'Shopping', status: 'In Progress', subTodos: [
  //     {id: 1, title: 'Buy Namkeen', status: 'In Progress'},
  //     {id: 2, title: 'Buy badaam', status: 'In Progress'}
  //   ]},
  //   {id: 2, title: 'Study', status: 'In Progress', subTodos: [
  //     {id: 1, title: 'Todo App all functionality', status: 'In Progress'},
  //     {id: 2, title: 'Complete reading Angular in 1 day', status: 'In Progress'},
  //     {id: 3, title: 'Watch 14th video of backend', status: 'Complete'}
  //   ]},
  //   {id: 3, title: 'Scooty Maintenance afafs', status: 'Complete', subTodos: [
  //     {id: 1, title: 'Make PUC of scooty', status: 'Complete'}
  //   ]},
  //   {id: 4, title: 'Scooty Maintenance maintenance', status: 'Complete', subTodos: [
  //     {id: 1, title: 'Make PUC of scooty', status: 'Complete'},
  //     {id: 2, title: 'Make PUC of scooty', status: 'Complete'},
  //   ]},
  //   {id: 5, title: 'Study', status: 'In Progress', subTodos: [
  //     {id: 1, title: 'Todo App all functionality', status: 'In Progress'},
  //     {id: 2, title: 'Complete reading Angular in 1 day afiofj ajiofja', status: 'In Progress'},
  //     {id: 3, title: 'Watch 14th video of backend', status: 'Complete'}
  //   ]},
  //   {id: 6, title: 'Study', status: 'In Progress', subTodos: [
  //     {id: 1, title: 'Todo App all functionality', status: 'In Progress'},
  //     {id: 2, title: 'Complete reading Angular in 1 day', status: 'In Progress'},
  //     {id: 3, title: 'Watch 14th video of backend', status: 'Complete'}
  //   ]},
  // ];

  ngOnInit(){
    const storedData = localStorage.getItem('todos');
    this.todos = storedData? JSON.parse(storedData) : [];
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
    this.todos.splice(todoIndex, 1);
    localStorage.setItem('todos', JSON.stringify(this.todos));  // Saving in localstorage
  }

  deleteSubTodo(todoIndex: number, subTodoIndex: number){
    this.todos[todoIndex].subTodos.splice(subTodoIndex, 1);
    this.checkSubTodosAndMarkParentTodo(todoIndex);
    localStorage.setItem('todos', JSON.stringify(this.todos));  // Saving in localstorage
  }

  // This function is to check if all the sub-todos are completed, then mark the parent also as complete
  checkSubTodosAndMarkParentTodo(todoIndex: number){
    for(let i=0; i<this.todos[todoIndex].subTodos.length; i++){
      // console.log(i);
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
      this.todos.push({id: largestId+1, title: currentTodo, status: "In Progress", subTodos: []});
    }
    localStorage.setItem('todos', JSON.stringify(this.todos));  // Saving in localstorage
  }

  addSubTodo(todoIndex: number){
    let currentSubTodo = prompt('Enter the Task: ');
    if(currentSubTodo?.trim()){  // Only process if user entered something
      let largestId = this.todos[todoIndex].subTodos[this.todos[todoIndex].subTodos.length-1]?.id || 0;
      this.todos[todoIndex].subTodos.push({id: largestId+1, title: currentSubTodo, status: "In Progress"});
      console.log(this.todos);
      if(this.todos[todoIndex].status === "Complete"){
        this.todos[todoIndex].status = "In Progress";
      }
    }
    localStorage.setItem('todos', JSON.stringify(this.todos));  // Saving in localstorage
  }

}
