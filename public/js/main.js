$(document).ready(function() {
    $('.deleteContact').on('click', deleteContact);
    $('.deleteActivity').on('click', deleteActivity);
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