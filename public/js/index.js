$(document).ready(function () {
$(".save-article-btn").click(function(event) {
  event.preventDefault();
  const button = $(this);
  const id = button.attr("id");
  $.ajax(`/save/${id}`, {
      type: "PUT"
  }).then(function() {
      const alert = `
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
      Your Article has been saved!
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
      </button>
      </div>`
      button.parent().append(alert);
      }
  );
});

$(".delete-btn").click(function (event) {
  event.preventDefault();
  const id = $(this).attr("id");
  $.ajax(`/remove/${id}`, {
      type: "PUT"
  }).then(function(){
      location.reload();
  })
});

    // event handler for opening the note modal
    $(".note-btn").click(function (event) {
      event.preventDefault();
      const id = $(this).attr("data");
      $('#article-id').text(id);
      $('#save-note').attr('data', id);
      $.ajax(`/articles/${id}`, {
          type: "GET"
      }).then(function (article) {
          console.log(article);
          $('.articles-available').empty();
          if (article[0].note.length > 0){
              article[0].note.forEach(v => {
                console.log(v);
                  $('.articles-available').append($(`<li class='list-group-item'>${v.text}<button type='button' class='btn btn-danger btn-sm float-right btn-deletenote' data='${v._id}'>X</button></li>`));
              })
          }
          else {
              $('.articles-available').append($(`<li class='list-group-item'>No notes for this article yet</li>`));
              console.log("No notes");
          }
      })
      $('#note-modal').modal('toggle');
  });

  $(document).on('click', '.btn-deletenote', function (){
    event.preventDefault();
    // console.log($(this).attr("data"))
    const id = $(this).attr("data");
    // console.log(id);
    $.ajax(`/note/${id}`, {
        type: "DELETE"
    }).then(function () {
        $('#note-modal').modal('toggle');
    });
});


$("#save-note").click(function (event) {
    event.preventDefault();
    const id = $(this).attr('data');
    const noteText = $('#note-input').val().trim();
    $('#note-input').val('');
    $.ajax(`/note/${id}`, {
        type: "POST",
        data: { text: noteText}
    }).then(function (data) {
        console.log(data)
    })
    $('#note-modal').modal('toggle');
});

});