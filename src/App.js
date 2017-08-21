import React from 'react';

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      todos: [],
      inputAdd:'',
      editableTodo:null,
      tempTodoName:''
    }
  }
  componentWillMount(){
    if(localStorage.getItem( 'todos' )){
      let storageTodos = JSON.parse( localStorage.getItem( 'todos' ) );
      this.setState({todos: storageTodos});
    }
  }
  addTodo(){
    let newTodos = this.state.todos.slice();
    newTodos.push( { id:this.generateId(), name: this.state.inputAdd, isComplete:false } );
    this.setState({todos:newTodos});
    this.setState({inputAdd:''});
    localStorage.setItem('todos',JSON.stringify(newTodos));
  };
  editTodo(todo, evt=null){
    if(this.state.editableTodo === todo){ 
      this.setState({editableTodo : null});
      if(evt !== null){
        evt.preventDefault();
      }
    }
    else{
      this.setState({editableTodo:todo});
      this.setState({tempTodoName:todo.name})
    }
  };
  onTodoEdit(todoToEdit){
    let newVal = document.querySelector('#editable').innerHTML;
    let newTodos = this.state.todos.slice();
    let idx = this.state.todos.findIndex( todo => todo === todoToEdit );
    newTodos[idx].name = newVal;
    this.setState({todos:newTodos});
    localStorage.setItem('todos',JSON.stringify(newTodos));
  }
  removeTodo(todoToRemove){
    let newTodos = this.state.todos.slice();
    let idx = this.state.todos.findIndex( todo => todo === todoToRemove );
    newTodos.splice(idx,1);
    this.setState({todos:newTodos});
    localStorage.setItem('todos',JSON.stringify(newTodos));
  };
  handleCheckboxChange(todoToEdit){
    let newTodos = this.state.todos.slice();
    let idx = this.state.todos.findIndex( todo => todo === todoToEdit );
    newTodos[idx].isComplete = !newTodos[idx].isComplete;
    this.setState({todos:newTodos});
    localStorage.setItem('todos',JSON.stringify(newTodos));
  }
  inputChange(evt){
    //input change handler
    this.setState({ inputAdd: evt.target.value.substr(0, 100) });
  };
  render(){
    return (
      <div>
        <h1>Welcome to my Todo List</h1>
        <TodoList 
          todos = {this.state.todos}
          tempTodoName = { this.state.tempTodoName}
          editableTodo = {this.state.editableTodo}
          editTodo = { this.editTodo.bind(this) }
          removeTodo = { this.removeTodo.bind(this) }
          onTodoEdit = { this.onTodoEdit.bind(this) }
          handleCheckboxChange = { this.handleCheckboxChange.bind(this) }
          ></TodoList>
        <InputArea 
          add={ this.addTodo.bind(this) }
          state={ this.state }
          inputChange={ this.inputChange.bind(this) }
        ></InputArea>
      </div>
  )
  }
  generateId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };
};
const TodoList = ({todos, editableTodo, removeTodo, editTodo, handleCheckboxChange, onTodoEdit, tempTodoName }) =>{
  return (
    <div>
      <ul>
        {todos.map(todo =>
          <li key={todo.id}>
            <div className="todo-info">
              <Checkbox 
              todo ={todo}
              handleCheckboxChange = { handleCheckboxChange }
              ></Checkbox>
              <TodoItem
              todo = { todo } 
              editableTodo = { editableTodo }
              onTodoEdit = { onTodoEdit }
              tempTodoName = { tempTodoName }
              editTodo = { editTodo }
              ></TodoItem>

            </div>
            <div>
              <button onClick = { () => removeTodo(todo)}>X</button>
              <button onClick = { () => editTodo(todo)}>Edit</button>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
};
const TodoItem =({todo, editableTodo, onTodoEdit, tempTodoName, editTodo}) =>{
    if(todo === editableTodo){
      return (<p id="editable"
      contentEditable
      className="editable" 
      onKeyPress={
        (evt) =>
          (evt.charCode === 13)? editTodo(todo,evt):onTodoEdit(todo)
      }>{tempTodoName}</p>)
    }
    else{
      return (<p >{todo.name}</p>)
    }
}
const Checkbox = ({todo, handleCheckboxChange}) =>{
  return(
    <input type="checkbox" 
      checked={ todo.isComplete } 
      onChange={ () => handleCheckboxChange(todo) }>
    </input>
  )
};
const InputArea = ({ add, state, inputChange }) => {
  return (
    <div className="input-area">
      <input 
        type="text" 
        value={state.inputAdd} 
        onChange={ (evt) => inputChange(evt)}
        onKeyPress={ (event) => { if(event.charCode === 13) add() } }
        ></input><button onClick ={() => add() }>Add Todo</button>
    </div>
  )
};
// App.PropTypes={
//   txt: React.PropTypes.string
// }
App.defaultProps = {
  txt: "this is the default txt"
}
export default App