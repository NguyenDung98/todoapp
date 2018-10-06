$(document).ready(function () {
    $.getJSON("/api/todos")
        .done(addTodos)
        .fail(function(error){
            console.log(error);
        });

    $("#todoInput").keypress(function (event) {
        if (event.keyCode === 13 && this.value !== "") {
            createTodo(this.value);
            this.value = "";
        }
    });
    $("ul").on("click", "span", function (event) {
        removeTodo($(this).parent());
        event.stopPropagation();
    });
    $("ul").on("click", "li", function () {
        updateTodo($(this));
    })
});

function addTodos(todos) {
    // add todos to the page
    todos.forEach(function (todo) {
        addTodo(todo)
    })
}

function addTodo(todo) {
    var newTodo = $('<li class="task">' + todo.name + '<span>x</span></li>');
    $(newTodo).data('id', todo._id);
    $(newTodo).data('completed', todo.completed);
    if (todo.completed) newTodo.addClass("done");
    $(".list").append(newTodo);
}

function createTodo(name) {
    // send request to create new todo
    var data = {
        name: name
    };
    $.post("/api/todos", data)
        .done(addTodo)
        .fail(console.log)

}

function removeTodo(todo) {
    var clickedId = todo.data('id');
    var deleteUrl = "/api/todos/" + clickedId;
    $.ajax({
        method: "DELETE",
        url: deleteUrl
    })
        .done(function () {
            todo.remove();
        })
        .fail(console.log);
}

function updateTodo(todo) {
    var updateUrl = "/api/todos/" + todo.data('id');
    var isDone = !todo.data('completed');
    var updateData = {
        completed: isDone
    };
    $.ajax({
        method: "PUT",
        url: updateUrl,
        data: updateData
    })
        .done(function () {
            todo.toggleClass("done");
            todo.data('completed', isDone);
        })
        .fail(console.log)
}