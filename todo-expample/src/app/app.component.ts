import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface IPerson { name: string; }
interface ITodo { id: Number; description: string; assignedTo: string; done: Boolean; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todo-expample';
  people: IPerson[] = [];
  todos: ITodo[] = [];
  undoneOnly: Boolean = false;
  mineOnly: Boolean = false;
  username: string;
  add: Boolean = false;
  selectedPerson: string = "";
  addDescription: string = "";
  
  constructor(private httpClient: HttpClient) { 
    
  }

  ngOnInit() {
    this.loadTodos();
    this.loadPeople();
  }

  getId(todo: ITodo): string {
    if(todo.done) return "done";
    return "undone";
  }

  show(todo: ITodo): Boolean {
    if (this.undoneOnly) { 
      if (todo.done) { 
        return false;
      }
        return true;
    } 
    return true;
  }

  showMine(todo: ITodo): Boolean {
    if(this.mineOnly) {
      if(todo.assignedTo.toUpperCase() == this.username.toUpperCase()) {
        return true;
      }
      return false;
    } 
    return true;
  }

  async loadPeople() {
    this.people = await this.httpClient
      .get<IPerson[]>('http://localhost:8080/api/people')
      .toPromise();
  }

  async loadTodos() {
    this.todos = await this.httpClient
      .get<ITodo[]>('http://localhost:8080/api/todos')
      .toPromise();
  }

  async postTodo() {
    await this.httpClient.post('http://localhost:8080/api/todos', {
      "description": this.addDescription,
      "assignedTo": this.selectedPerson
    }).toPromise();
    this.loadTodos();
  }

  async doneTodo(todo: ITodo) {
    await this.httpClient.patch(`http://localhost:8080/api/todos/${todo.id}`, {
      "done": true
    }).toPromise();
    this.loadTodos();
  }

  async undoneTodo(todo: ITodo) {
    await this.httpClient.patch(`http://localhost:8080/api/todos/${todo.id}`, {
      "done": false
    }).toPromise();
    this.loadTodos();
  }

  async deleteTodo(todo: ITodo) {
    await this.httpClient.delete(`http://localhost:8080/api/todos/${todo.id}`)
    .toPromise();
    this.loadTodos();
  }

  async saveTodo(todo: ITodo) {
    await this.httpClient.patch(`http://localhost:8080/api/todos/${todo.id}`, {
      "description": todo.description,
      "assignedTo": todo.assignedTo
    }).toPromise();
    this.loadTodos();
  }

}
