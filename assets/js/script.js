// First, I'm extended the primitives a little bit. I know that is a very bad
// practice at all, but is JS so idfc.

// how in hell JS doesn't has a method for title case?
Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

const tasks = [
    {
        id: 1,
        title: 'Do groceries',
        description: 'We need some vegetables for next friday dinner; we\'ll eat chop suey',
        status: 'planned',
        dueDate: '2023-12-31',
        overdue: false,
    },
    {
        id: 2,
        title: 'Study Session',
        description: 'Prepare the next study session, we\'ll be studying data structures.',
        status: 'planned',
        dueDate: '2023-12-31',
        overdue: false,
    },
    {
        id: 3,
        title: 'Water plants',
        description: 'Pls, don\'t let plants die.',
        status: 'planned',
        dueDate: '2023-12-31',
        overdue: false,
    },
]

function taskStats(tasks){
    /**
        * This function generates stats from an array of tasks.
        * Returns an object with the needed stats.
        */

    let planned = 0;
    let inProgress = 0;
    let completed = 0;
    let cancelled = 0;
    let overdue = 0;

    tasks.forEach(task => {
        switch (task.status) {
            case 'planned':
                ++planned;
                break;
            case 'in-progress':
                ++inProgress;
                break;
            case 'completed':
                ++completed;
                break;
            case 'cancelled':
                ++cancelled;
                break;
        }
        if (task.overdue) ++overdue;
    })

    return {
        planned: planned,
        inProgress: inProgress,
        completed: completed,
        cancelled: cancelled,
        overdue: overdue,
    }
}

function showStats(stats) {
    /**
        * This function takes care about properly show the stats on our page.
        */
    const plannedCell = document.getElementById('show-planned');
    const inProgressCell = document.getElementById('show-in-progress');
    const completedCell = document.getElementById('show-completed');
    const cancelledCell = document.getElementById('show-cancelled');
    const overdueCell = document.getElementById('show-overdue');
    const totalCell = document.getElementById('show-total');

    plannedCell.innerText = stats.planned;
    inProgressCell.innerText = stats.inProgress;
    completedCell.innerText = stats.completed;
    cancelledCell.innerText = stats.cancelled;
    overdueCell.innerText = stats.overdue;
    totalCell.innerText = stats.planned + stats.inProgress + stats.completed + stats.cancelled;
}

function createTask(tasks) {
    /** 
        * This function creates a task from the user input.
        * A task has six attributes:
        * id
        * title
        * description
        * dueDate
        * overdue
        *
        * The id is dynamically created, depending on previously created tasks,
        * and should be unique. 
        * The title is a descriptive name for the task itself.
        * The description should provide context to the task, or maybe could be
        * the needed steps to achieve the goal behind the task.
        * The status could be: planned, in progress if task has been marked by
        * the user; or cancelled, also marked by the user;
        * The dueDate is the deadline for the task.
        * The overdue flag is setted on creation, also will be checked 
        * somewhere in code, but I haven't chose how I'm gonna implement this.
        */

    // get inputs from user
    const title = document.getElementById('task-title');
    const description = document.getElementById('task-description');
    const dueDate = document.getElementById('task-date');
    const today = new Date().toISOString().split('T')[0];

    // set overdue flag, depending on dates.
    let overdue;
    dueDate.value >= today ? overdue = false : overdue = true;


    /*
        * from my perspective, id shouldn't take numbers already used, even
        * though the task with this id was deleted. Instead, the id should be
        * a new number, ideally the next to the last task. I'm aware that the 
        * approach that I'm taking here is not fully implemented yet, because 
        * on the border case when I delete the last task, and then create a new
        * one, the id of the new one will be the same as the deleted one.
    */

    // id generation
    let id;
    if (tasks.length){
        const lastId = tasks[tasks.length - 1].id; // last added task id
        lastId >= tasks.length ? id = lastId + 1 : id = tasks.length + 1;
    } else {
        id = 1;
    }

    // on creation, the status is planned. The user can change it later
    const status = 'planned';

    // create the object itself
    const task = {
        id: id,
        title: title.value,
        description: description.value,
        status: status,
        dueDate: dueDate.value,
        overdue: overdue,
    };

    /*
        * idk if a function should take care of clear the input fields, but
        * right now I'm implementing this here, maybe I'll reimplement this in
        * a distant future.
    */

    // clear the input and textarea fields
    title.value = '';
    description.value = '';
    dueDate.value = today;

    // return the task object
    return task;
}

function createOption(option) {
    /**
        * This function creates an option tag for the select tag to change the 
        * status of a task.
        *
        * I saw myself writting this more times that I've should, so here we are.
        */
    const opt = document.createElement('option');
    opt.value = option;
    opt.appendChild(
        document.createTextNode(
            option
            .split('-')
            .map(
                string => string.capitalize())
            .join(' '))
    );
    return opt;
}

function showTasks(tasks) {
    /** 
        * This function will add all needed task elements to the table
    */

    // select table body, so we can add all the elements
    const taskTableBody = document.getElementById('task-table-body');
    taskTableBody.innerHTML = '';
    
    tasks.forEach(task => {
        // one task, one row
        const row = taskTableBody.insertRow();
        // the cells, one for each column
        const titleCell = row.insertCell();
        const statusCell = row.insertCell();
        const dueDateCell = row.insertCell();
        const deleteTaskCell = row.insertCell();

        // the select tag to display a dropdown menu to change task status
        const statusSelect = document.createElement('select');
        // the options for the dropdown menu
        const plannedOption = createOption('planned');
        const inProgressOption = createOption('in-progress');
        const completedOption = createOption('completed');
        const cancelledOption = createOption('cancelled');
        // appending the options to select tag
        statusSelect.appendChild(plannedOption);
        statusSelect.appendChild(inProgressOption);
        statusSelect.appendChild(completedOption);
        statusSelect.appendChild(cancelledOption);

        // status id matching task id will make my life easier on status change
        statusSelect.id = task.id;

        //remove button
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.classList.add('delete-btn')
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash fa-xl"></i>';

        // title and show description on hover capability
        const titleDiv = document.createElement('div');
        titleDiv.classList.add('tooltip');
        
        const descriptionSpan = document.createElement('span');
        descriptionSpan.classList.add('tooltip-text');
        
        titleDiv.appendChild(document.createTextNode(task.title));
        descriptionSpan.appendChild(document.createTextNode(task.description));
        titleDiv.appendChild(descriptionSpan);

        // appending child elements to every cell
        titleCell.appendChild(titleDiv);
        statusCell.appendChild(statusSelect);
        dueDateCell.appendChild(document.createTextNode(task.dueDate));
        deleteTaskCell.appendChild(deleteBtn);

        // adding class to center the cell content
        statusCell.classList.add('centered');
        dueDateCell.classList.add('centered');
        deleteTaskCell.classList.add('centered');
    });

    // enabling capabilities
    changeStatusCapability();
    deleteCapability()
}

function changeStatus(event, tasks) {
    const newStatus = event.target.value;
    const selectCell = event.target.parentElement;
    const id = parseInt(selectCell.firstChild.id);
    tasks.map(task => {if (task.id === id) task.status = newStatus});
    showStats(taskStats(tasks));
}

// adding capability to change task status from dropdown selector
/**
    * This function will add the capability to update the status of a task.
    * I chose this approach because I'm creating this dynamically, and I'm
    * refreshing the table on every change, so I need to re-add the capability
    */
function changeStatusCapability () {
    document.getElementById('task-table-body').querySelectorAll('tr').forEach(
        row => {
            row.cells[1].addEventListener('change', event => {
                changeStatus(event, tasks);
            });
        }
    );
}

// adding capability to delete a task
/**
    * This function implements the capability to delete a task.
    * I chose this approach for the same reason that previously defined
    * function.
    */
function deleteCapability() {
    document.getElementById('task-table-body').querySelectorAll('tr').forEach(
        row => {
            row.cells[3].firstChild.addEventListener('click', (event) => {
                const id = parseInt(event.target.parentElement.id);
                let taskIndex;
                tasks.forEach((task, index) => {
                    if (task.id === id) {
                        taskIndex = index;
                    }
                });
                tasks.splice(taskIndex, 1);
                showTasks(tasks);
                showStats(taskStats(tasks));
            });
        }
    );
}

// set default date value to today
document.getElementById('task-date').valueAsDate = new Date();

// adding capabilities to add button
document.getElementById('btn-add').addEventListener('click', () => {
    tasks.push(createTask(tasks));
    showTasks(tasks);
    showStats(taskStats(tasks));
});

// initialization
showTasks(tasks);
showStats(taskStats(tasks));
