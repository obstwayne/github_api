$(document).ready(function() {
    function loadUsersHistory() {
        let history = JSON.parse(localStorage.getItem('usersHistory')) || [];
        let historyOutput = '<strong>Last searched:</strong><ul>';
        history.forEach(username => {
            historyOutput += `<li>${username}</li>`;
        });
        historyOutput += '</ul>';
        $('#search-history').html(historyOutput);
    }

    loadUsersHistory();
    
    $('#search-repos-button').click(function() {
        let username = $('#username').val().trim();
        if (username === '') {
            alert('Please enter a valid GitHub username');
            return;
        }

        let history = JSON.parse(localStorage.getItem('usersHistory')) || [];

        if (!history.includes(username)) {
            history.unshift(username);
            if (history.length > 5) {
                history.pop();
            }
            localStorage.setItem('usersHistory', JSON.stringify(history));
        }

        loadUsersHistory();

        $.getJSON('api.php?user=' + username, function(data) {
            if (data.message) {
                $('#list-of-repos').html('<p>' + data.message + '</p>');
                return;
            }

            let output = '<ul>';
            console.log('Api answer:', data);

            data.forEach(repo => {
                output += `<li><a href="${repo.html_url}" target="_blank">${repo.name}</a><br>
                <strong>Description: </strong> ${repo.description || 'No description'} <br>
                <strong>Created at: </strong> ${new Date(repo.created_at).toLocaleDateString()} <br>
                <strong>Stars: </strong> ${repo.stargazers_count} <br>
                <strong>Forks: </strong> ${repo.forks_count} <br>
                <strong>Languages: </strong> <span id="languages-${repo.id}"> Wait a sec...</span> <br> 
                </li>`;

                $.getJSON(repo.languages_url, function (languages) {
                    let languagesList = Object.keys(languages).join(', ') || 'No lang data';
                    $(`#languages-${repo.id}`).text(languagesList);
                }).fail(function() {
                    $(`#languages-${repo.id}`).text('Failed to load lang data');
                });
            });
            
            output += '</ul>';
            $('#list-of-repos').html(output);
        }).fail(function() {
            $('#list-of-repos').html(`<p>AJAX error: ${textStatus} - ${errorThrown}</p>`);
        });
    });
})