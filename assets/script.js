$(document).ready(function() {
    $('#search-repos-button').click(function() {
        let username = $('#username').val().trim();
        if (username === '') {
            alert('Please enter a valid GitHub username');
            return;
        }

        $.getJSON('api.php?user=' + username, function(data) {
            if (data.message) {
                $('#list-of-repos').html('<p>' + data.message + '</p>');
                return;
            }

            let output = '<ul>';
            console.log('Ответ от API:', data);

            data.forEach(repo => {
                output += `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a></li>`;
            });
            output += '</ul>';
            $('#list-of-repos').html(output);
        }).fail(function() {
            $('#list-of-repos').html(`<p>Ошибка AJAX: ${textStatus} - ${errorThrown}</p>`);
        });
    });
})