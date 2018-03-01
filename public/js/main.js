$(document).ready(function() {
    $('.deleteContact').on('click', deleteContact);
});

function deleteContact() {
    var confirmation = confirm('Are you sure ?');
    if(confirmation){
        $.ajax({
            type: 'DELETE',
            url: '/admin/delete/' +$('.deleteContact').data('id')
        }).done(function(response) {
            window.location.replace('/admin');
        });
    }
    else {
        return false;   
    }
}