const tasks = [
    {
        id: 1,
        title: 'Do groceries',
        description: 'We need some vegetables for next friday dinner; we\'ll eat chop suey',
        status: 'planned',
        dueDate: '2023-12-31',
    },
    {
        id: 2,
        title: 'Study Session',
        description: 'Prepare the next study session, we\'ll be studying data structures.',
        status: 'planned',
        dueDate: '2023-12-31',
    },
    {
        id: 3,
        title: 'Water plants',
        description: 'Pls, don\'t let plants die.',
        status: 'planned',
        dueDate: '2023-12-31',
    },
]

function createTask(tasks) {
    // get inputs from user
    const title = document.getElementById('task-title');
    const description = document.getElementById('task-description');
    const dueDate = document.getElementById('task-date');
    const today = new Date().toISOString().split('T')[0];
    const lastId = tasks[tasks.length - 1].id;
    // status could be planned or overdue, depending on dates
    let status;
    dueDate > today ? status = 'planned' : status = 'overdue';
    // generate id dynamically
    let id;
    lastId >= tasks.length ? id = lastId + 1 : id = tasks.length + 1;
    // create the object itself
    return {
        id: id,
        title: title,
        description: description,
        status: status,
        dueDate: dueDate,
    };
    // return the task array plus the last created task
}

function showTasks(tasks) {
    const table = document.getElementById('task-table');
    tasks.forEach(task => {
        const tr = table.insertRow();
        const titleTd = tr.insertCell();
        const statusTd = tr.insertCell();
        const dateTd = tr.insertCell();
        const title = document.createTextNode(task.title);
        const status = document.createTextNode(task.status);
        const dueDate = document.createTextNode(new Date(task.dueDate).toLocaleDateString());
        titleTd.appendChild(title);
        statusTd.appendChild(status);
        dateTd.appendChild(dueDate);
    })
}

document.getElementById('btn-add').addEventListener('click', () => {
    tasks.push(createTask(tasks));
})

showTasks(tasks);
