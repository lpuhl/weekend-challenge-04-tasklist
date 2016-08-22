$(document).ready(function () {
  getTasks();

  $('#task-submit').on('click', postTask);
  $('#task-list').on('click', '.update', updateTask);
  $('#task-list').on('click', '.done', completeTask);
  $('#task-list').on('click', '.delete', deleteTask);
});


function completeTask() {
  console.log('this.parent', $(this).parent());
  var task = {};
  var inputs = $(this).parent().children().serializeArray();
  var taskId = $(this).parent().data('taskID');
  console.log('tasks we are updating', task);
  $(this).parent().toggleClass('complete');

  $.ajax({
    type: 'PUT',
    url: '/tasklist/complete/' + taskId,
    data: task,
    success: function () {
      console.log('success!');
      // getTasks();
    },
    error: function () {
      console.log('Error PUT /tasklist/' + taskId);
    },
  });
}


function getTasks() {
 $.ajax({
   type: 'GET',
   url: '/tasklist',
   success: function (tasks) {
     console.log('GET /tasklist returns:', tasks);
     tasks.forEach(function (task) {
       var $el = $('<div class="taskRow"></div>');
       // create editable descriptions below input form
       var taskProperties = ['description'];
       taskProperties.forEach(function(property){
         var inputType = 'text';
         var $input = $('<input type ="text" id="' + property + '"name="' + property + '"/>')
         $input.val(task[property]);
         $el.append($input);
       });
       $el.data('taskID',task.id);
      console.log('completed?', task.completed);
       //we use this to uniquely identify it by the task.id
       if (task.completed == true) {
         $el.addClass('complete');
         console.log($(this));
       }
       $el.append('<button class ="update">Update</button>');
       $el.append('<input type="checkbox" class ="done">Done</button>');
       $el.append('<button class ="delete">Delete</button>');
       $('#task-list').append($el);
     });
   },
   error: function (response) {
     console.log('GET /tasklist fail. No tasks could be retrieved!');
   },
 });
}


function postTask() {
  event.preventDefault();
  var task = {};
  $.each($('#task-form').serializeArray(), function (i, field) {
    task[field.name] = field.value;
    task.complete = false;
  });

  $.ajax({
    type: 'POST',
    url: '/tasklist',
    data: task,
    success: function () {
      console.log('POST /tasklist works!');
      $('#task-list').empty();
      getTasks();
    },

    error: function (response) {
      console.log('POST /tasklist does not work...');
    },
  });
}

function updateTask() {
  var task = {};
  var inputs = $(this).parent().children().serializeArray();
  $.each(inputs, function (i, field) {
    task[field.name] = field.value;
  });
  var taskId = $(this).parent().data('taskID');
  console.log('tasks we are updating', task);
  $.ajax({
    type: 'PUT',
    url: '/tasklist/' + taskId,
    data: task,
    success: function () {
      $('#task-list').empty();
      getTasks();
    },
    error: function () {
      console.log('Error PUT /tasklist/' + taskId);
    },
  });
};

function deleteTask() {
  var taskId = $(this).parent().data('taskID');
  $.ajax({
    type: 'DELETE',
    url: '/tasklist/' + taskId,
    success: function () {
      console.log('DELETE success');
      $('#task-list').empty();
      getTasks();
    },
    error: function () {
      console.log('DELETE failed');
    }
  });
}
