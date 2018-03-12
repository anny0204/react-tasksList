var Task = React.createClass({
    render: function(){
        var txtDec = {textDecoration: this.props.done ? "line-through" : "none"}
        return (
            <tr style={txtDec}>
                <td>{this.props.taskName}</td>
                <td>{this.props.description}</td>
                <td><input type="checkbox" checked={this.props.done} onChange={this.props.changeTaskDone}/></td>
                <td><button className="btn btn-default edit_btn" onClick={this.props.editTask}>Edit</button></td>
            </tr>
        )
    }
});

var NewTask = React.createClass({

    getInitialState: function() {
        return {
            taskName: '',
            description: ''
        }
    },
    
    saveOrEditTask: function() {
        if (!this.props.currentTask.id) {
            var taskId = Date.now();
            var done = false;
        }
        else {
            var taskId = this.props.currentTask.id;
            var done = this.props.currentTask.done;
        };

        var newTask = {
            id: taskId,
            taskName: this.state.taskName,
            description: this.state.description,
            done: done
        };

        this.setState({taskName: '', description: ''});
        this.props.saveTask(newTask);
    },

    handleTaskNameChange: function() {
        this.setState({taskName: this.refs.taskName.value});
    },

    handleDescriptionChange: function() {
        this.setState({description: this.refs.taskDescription.value});
    },

    render: function() {
        return (
            <div className="panel panel-body new_task">
            <h3>{this.props.title}</h3>
            <div className="input-group">
                <label htmlFor="taskName">Task name: </label>
                <input className="form-control" id="taskName" ref="taskName" value={this.state.taskName} onChange={this.handleTaskNameChange}/>  
            </div>
            <div className="input-group">
                <label htmlFor="taskDescription">Task description: </label>
                <textarea className="form-control" id="taskDescription" ref="taskDescription" value={this.state.description} onChange={this.handleDescriptionChange}></textarea>
            </div>
            <button className="btn btn-default" onClick={this.saveOrEditTask}>Save</button>
        </div>
        )
    }
});

var TasksApp = React.createClass({
    
    getInitialState: function(){
        return {
            tasks: [],
            currentTask: {}
        }
    },

    componentWillMount: function() {
        this._readFromLocalStorage();
    },

    componentDidMount: function() {
        this.setTitle();
    },

    componentDidUpdate: function(){
        this._writeToLocalStorage();
        this.setTitle();
    },

    _readFromLocalStorage: function() {
        var tasks = JSON.parse(localStorage.getItem('tasks'));
        if (tasks)
            this.setState({tasks: tasks});
    },

    _writeToLocalStorage: function() {
        localStorage.setItem('tasks', JSON.stringify(this.state.tasks));
    },

    handleChangeDone: function(task) {
        var newTasks = [];
        newTasks = this.state.tasks.slice();
        var taskId = task.id;
        newTasks.forEach(el => {
            if (el.id == taskId) {
                el.done = !el.done;
            }
        });
        this.setState({tasks: newTasks});
    },

    handleSaveTask: function(newTask) {
        var newTaskId = newTask.id;
        var newTasks = [];
        newTasks = this.state.tasks.slice();
        if (this.state.currentTask.id) {
            newTasks.forEach(function(el){
                if (el.id == newTaskId) {
                    el.taskName = newTask.taskName;
                    el.description = newTask.description;
                }
            });
        } else
            newTasks.unshift(newTask);
        this.setState({tasks: newTasks, currentTask: {}});
    },

    handleEditTask: function(currentTask) {
        this.setState({currentTask: currentTask});
        this.refs.newTask.setState({taskName: currentTask.taskName, description: currentTask.description});
    },

    setTitle: function() {
        if (!this.state.currentTask.id)
            return "Enter new task"
        else
            return "Editing current task.."
    },

    render: function(){
        var handleChangeDone = this.handleChangeDone;
        var handleEditTask = this.handleEditTask;
        return (
            <div className="tasksApp panel-body">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Task name</th>
                            <th>Description</th>
                            <th>Done</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                            {
                                this.state.tasks.map(function(task){
                                    return <Task key={task.id}
                                        taskName={task.taskName}
                                        description={task.description}
                                        done={task.done}
                                        changeTaskDone={handleChangeDone.bind(null, task)}
                                        editTask={handleEditTask.bind(null, task)}
                                    />
                                })
                            }
                    </tbody>
                </table>
                <NewTask saveTask={this.handleSaveTask}
                    ref="newTask"
                    title={this.setTitle()}
                    currentTask={this.state.currentTask}/>
            </div>
        )
    }
});

ReactDOM.render(
    <TasksApp />,
    document.getElementById("point_mount")
);