import React, { Component } from "react";
import NewTodoForm from "./NewTodoForm";
import Todo from "./Todo";
import "./TodoList.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "axios";

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: []
    };
    this.create = this.create.bind(this);
    this.remove = this.remove.bind(this);
    this.update = this.update.bind(this);
    this.toggleCompletion = this.toggleCompletion.bind(this);
  }
  componentDidMount(){
     axios
      .get("http://localhost:4000/")
      .then((res) => {
        this.setState({ todos: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  create(newTodo) {
    const newItem = {name:newTodo.name}
    axios({
      method: "post",
      url: "http://localhost:4000/",
      headers: {
        "Content-Type": "application/json",
      },
      data: newItem,
    })
      .then((res) => {
        this.setState({ todos: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  remove(id) {
    const choosenItem = {_id:id}
    axios({
      method: "delete",
      url: "http://localhost:4000/delete",
      headers: {
        "Content-Type": "application/json",
      },
      data: choosenItem,
    })
      .then((res) => {
        this.setState({ todos: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  update(id, updatedTask) {
    const updateItem = { _id: id, name:updatedTask };
    axios({
      method: "put",
      url: "http://localhost:4000/update",
      headers: {
        "Content-Type": "application/json",
      },
      data: updateItem,
    })
      .then((res) => {
        this.setState({ todos: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  toggleCompletion(id) {
    const updatedTodos = this.state.todos.map(todo => {
      if (todo._id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    this.setState({ todos: updatedTodos });
  }
  render() {
    const todos = this.state.todos.map(todo => {
      return (
        <CSSTransition key={todo._id} timeout={500} classNames='todo'>
          <Todo
            key={todo._id}
            id={todo._id}
            task={todo.name}
            completed={todo.completed}
            removeTodo={this.remove}
            updateTodo={this.update}
            toggleTodo={this.toggleCompletion}
          />
        </CSSTransition>
      );
    });
    return (
      <div className='TodoList'>
        <h1>
          Get To Work! 
        </h1>
        <NewTodoForm createTodo={this.create} />

        <ul>
          <TransitionGroup className='todo-list'>{todos}</TransitionGroup>
        </ul>
      </div>
    );
  }
}
export default TodoList;
