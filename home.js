fetch('https://services.minbrowser.org/web-events/v1/collect', {
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        os: getUserPlatform(),
        event: 'pageview',
        version: 'a'
    })
})

Array.from(document.querySelectorAll('.download-button')).forEach(function(button) {
    button.addEventListener('click', function() {
        fetch('https://services.minbrowser.org/web-events/v1/collect', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                os: getUserPlatform(),
                event: 'downloadbutton',
                version: 'a'
            })
        })
    })
})
