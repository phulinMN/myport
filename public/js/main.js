$(document).ready(function() {
    $('.deleteContact').on('click', deleteContact);
});

$(document).ready(function() {
    $('.deleteActivity').on('click', deleteActivity);
});

$("#textbox").change(function() {
    alert("Change detected!");
});


function deleteContact() {
    var confirmation = confirm('Are you sure ?');
    if(confirmation){
        $.ajax({
            type: 'DELETE',
            url: '/admin/contact-delete/' +$('.deleteContact').data('id')
        }).done(function(response) {
            window.location.replace('/admin');
        });
    }
    else {
        return false;   
    }
}

function deleteActivity() {
    var confirmation = confirm('Are you sure ?');
    if(confirmation) {
        $.ajax({
            type: 'DELETE',
            url: '/admin/delete/' +$('.deleteActivity').data('id')
        }).done(function(response) {
            window.location.replace('/admin');
        });
    }
    else {
        return false;   
    }
}