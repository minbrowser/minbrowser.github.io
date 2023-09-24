const variants = [
    ['a', 0.8],
    ['b', 0.2]
]

let chosenVariant = ''
let sum = 0
let r = Math.random();
for (let variant of variants) {
    sum += variant[1];
    if (r <= sum) {
        chosenVariant = variant[0]
        break
    }
}

document.body.classList.add('variant-' + chosenVariant)

if (chosenVariant === 'b') {
    Array.from(document.querySelectorAll('.download-button .button-label')).forEach(function(label) {
        const platform = getUserPlatform()
        if (platform === 'mac') {
            label.textContent = 'Download for macOS';
        } else if (platform === 'windows') {
            label.textContent = 'Download for Windows';
        } else if (platform === 'linux') {
            label.textContent = 'Install for Linux';
        }
    });
}

if (window.location.hostname  === 'minbrowser.org') {
    fetch('https://services.minbrowser.org/web-events/v1/collect', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            os: getUserPlatform(),
            event: 'pageview',
            version: chosenVariant,
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
                    version: chosenVariant
                })
            })
        })
    })
}