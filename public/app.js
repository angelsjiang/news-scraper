$.getJSON("/articles", function(data) {
    getArticles(data);
});

$(document).on("click", ".list-group-item.list-group-item-action", function() {
    let articleId = $(".list-group-item.list-group-item-action").data("artid");
    console.log(articleId);
    $(".save-comment").attr("data-artId", articleId);

    let title = "Notes for this article: " + $(this).data("title");
    $(".modal-title").text(title);

});

$(document).on("click", ".scrape-news", function(event) {
    event.preventDefault();

    // alert("Yo!");

    $.ajax({
        url: "/scrape",
        type: "GET"
    }).then(function(result) {
        location.reload();
    });
});

$(document).on("click", ".clear-news", function(event) {
    event.preventDefault();

    // alert("Yoyo!");

    $.ajax({
        url: "/articles/clear",
        type: "delete"
    }).then(function(result) {
        location.reload();
    });
});

$(document).on("click", ".saved-news", function(event) {
    event.preventDefault();

    // alert("Yoyoyo!");

    $.ajax({
        url: "/articles/saved",
        type: "get"
    }).then(function(data) {

        getArticles(data);
    });
});

$(document).on("click", ".save-btn", function(event) {
    event.preventDefault();

    // alert("yoyoyoyo!");

    let id = $(this).data("article");
    console.log(id);

    $.ajax({
        url: "/articles/" + id,
        type: "put"
    }).then(function(result) {
        console.log(result);
    });

    $(this).attr("disabled", true);
});


$(document).on("click", ".home-btn", function() {
    $.getJSON("/articles", function(data) {
        getArticles(data);
    });
});

$(document).on("click", ".save-comment", function() {
    alert("save comment!");

    var thisId = $(".save-comment").data("artid");
    // console.log(thisId);

    $.ajax({
        url: "/articles/comment/" + thisId,
        type: "POST",
        data: {
            title: $("#comment-title").val().trim(),
            body: $("#comment-body").val().trim()
        }
    }).then(function(data) {
        console.log(data);
    })
});


// re-usable functions
var getArticles = (data) => {

    $(".list-group").empty();

    console.log(data);
    for (var i = 0; i < data.length; i++) {

        let saved = data[i].saved;
        console.log(saved);

        let save_btn;

        if(saved) {
            save_btn = `<button type="button" class="btn btn-warning save-btn" data-article=${data[i]._id} disabled>Save Article</button>`
        }
        else {
            save_btn = `<button type="button" class="btn btn-warning save-btn" data-article=${data[i]._id}>Save Article</button>`
        }

        $(".list-group").append(`
            <div class="list-group-item list-group-item-action flex-column align-items-start" data-toggle="modal" 
            data-target="#exampleModalCenter" data-title="${data[i].title}" data-artId="${data[i]._id}">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${data[i].title}</h5>
                </div>
                <p class="mb-1">${data[i].summary}</p>
                ${save_btn}
            </div>
        `)
    };
};