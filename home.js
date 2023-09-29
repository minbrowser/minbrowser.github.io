const variants = [
    ['a', 0.7],
    ['c', 0.3]
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

if (chosenVariant === 'c') {
    const platform = getUserPlatform()
    if (platform === 'windows') {
        document.getElementById('header-image').src = 'splash/tabbar-windows.png';
    }
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