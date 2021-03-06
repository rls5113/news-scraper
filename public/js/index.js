$(document).ready(function () {
    $(".delete-btn").click(function (event) {
        event.preventDefault();
        const id = $(this).attr("data");
        $.ajax(`/remove/${id}`, {
            type: "PUT"
        }).then(function(){
            location.reload();
        })
    });

       // event handler for opening the note modal
       $(".note-btn").click(function (event) {
        event.preventDefault();
        console.log(event); 
        const id = $(this).attr("data");
        console.log(this);
        $("#article-id").text(id);
        $("#save-note").attr("data", id);
        $.ajax(`/articles/${id}`, {
            type: "GET"
        }).then(function (article) {
            console.log("Article: "+article);
            $(".articles-available").empty();
            if (article.note[0].length > 0){
                article.note[0].forEach(v => {
                  console.log("Note: "+ v);
                    $(".articles-available").append($(`<li class="list-group-item">${v.text}<button type="button" class="btn btn-danger btn-sm float-right btn-deletenote" data="${v._id}">X</button></li>`));
                })
            }
            else {
                $(".articles-available").append($(`<li class="list-group-item">No notes for this article yet</li>`));
                console.log("No notes");
            }
        })
        $("#note-modal").modal("toggle");
    });


$(".save-article-btn").click(function(event) {
   console.log("in save article");
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



 

  $(document).on("click", ".btn-deletenote", function (){
    event.preventDefault();
    // console.log($(this).attr("data"))
    const id = $(this).attr("data");
    // console.log(id);
    $.ajax(`/note/${id}`, {
        type: "DELETE"
    }).then(function () {
        $("#note-modal").modal("toggle");
    });
});


$("#save-note").click(function (event) {
    event.preventDefault();
    const id = $(this).attr("data");
    const noteText = $("#note-input").val().trim();
    $("#note-input").val("");
    $.ajax(`/note/${id}`, {
        type: "POST",
        data: { text: noteText}
    }).then(function (data) {
        console.log(data)
    })
    $("#note-modal").modal("toggle");
});

});