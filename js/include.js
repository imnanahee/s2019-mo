$(document).ready(function () {
    $('[data-include-path]').each(function () {
        var includePath = $(this).data('includePath');
        if (includePath) {
            $.ajax({
                url: includePath,
                type: 'GET',
                success: function (response) {
                    $(this).replaceWith(response);
                }.bind(this)
            });
        }
    });
});