$.getJSON("/articles", function(data) {
    getArticles(data);
});

$(document).on("click", ".list-group-item.list-group-item-action", function() {
    alert("clicked!");

    $(".modal").append(`
        <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalCenterTitle">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    </div>
                    <div class="modal-body">
                    ...
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    `)

    // $(".modal").show();
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
            <div class="list-group-item list-group-item-action flex-column align-items-start">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${data[i].title}</h5>
                </div>
                <p class="mb-1">${data[i].summary}</p>
                ${save_btn}
            </div>
        `)
    };
};