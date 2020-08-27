function showMacDialog () {
  var backdrop = document.createElement('div')
  backdrop.className = 'backdrop'
  document.body.appendChild(backdrop)

  var dialog = document.createElement('div')
  dialog.className = 'dialog centered'
  dialog.innerHTML = '<h1>How to install Min</h1>\
  <ul>\
    <li>Drag Min from your Downloads folder to the Applications folder.</li>\
    <li>Right click on Min.</li>\
    <li>Choose "Open".</li>\
    <li>If a warning dialog is shown, choose "Open".</li>\
  </ul>'

  var dialogButton = document.createElement('button')
  dialogButton.className = 'button outlined-button outlined-button-white'
  dialogButton.setAttribute('style', 'display: block; margin: auto')
  dialogButton.textContent = 'Done'
  dialog.appendChild(dialogButton)
  dialogButton.addEventListener('click', function () {
    backdrop.parentNode.removeChild(backdrop)
    dialog.parentNode.removeChild(dialog)
  })

  document.body.appendChild(dialog)
}

function showLinuxDialog (downloadLinks) {
  var backdrop = document.createElement('div')
  backdrop.className = 'backdrop'
  document.body.appendChild(backdrop)
  backdrop.addEventListener('click', function () {
    backdrop.parentNode.removeChild(backdrop)
    dialog.parentNode.removeChild(dialog)
  })

  var dialog = document.createElement('div')
  dialog.className = 'dialog centered'
  dialog.innerHTML = '\
  <h3> For Debian-based distributions:</h3>\
  <a id="download-deb-link"><button class="button outlined-button outlined-button-white" style="display: block; margin: auto">Download .deb</button></a>\
  <div>Install with <pre style="display: inline-block; margin-left: 0.5em">sudo dpkg -i /path/to/download</pre> </div>\
  <h3> For RPM-based distributions:</h3>\
  <a id="download-rpm-link"><button id="download-rpm-button" class="button outlined-button outlined-button-white" style="display: block; margin: auto">Download .rpm</button></a>\
  <div>Install with <pre style="display: inline-block; margin-left: 0.5em">sudo rpm -i /path/to/download --ignoreos</pre> </div>\
  '

  dialog.querySelector('#download-deb-link').href = downloadLinks.deb
  dialog.querySelector('#download-rpm-link').href = downloadLinks.rpm

  document.body.appendChild(dialog)
}

/* check if Min is available for the user's computer */

var failMessage = "Min isn't supported on your OS"

// matches against navigator.platform
var platformMatchStrings = {
  'MacIntel': 'https://github.com/minbrowser/min/releases/download/v1.16.0/Min-v1.16.0-darwin-x64.zip',
  // electron no longer supports 32-bit linux (https://electronjs.org/blog/linux-32bit-support), so there's only a 64-bit build available
  'Linux aarch64': 'https://github.com/minbrowser/min/releases/download/v1.16.0/min_1.16.0_armhf.deb',
  // this could be either 32- or 64- bit, but we only have 64-bit downloads, so just display that and hope it works
  'Linux': {
    // there isn't an obvious way to detect deb- or rpm-based systems
    deb: 'https://github.com/minbrowser/min/releases/download/v1.16.0/min_1.16.0_amd64.deb',
    rpm: 'https://github.com/minbrowser/min/releases/download/v1.16.0/min-1.16.0-1.x86_64.rpm'
  }
}

// matches against navigator.userAgent
var UAMatchStrings = {
  'Win64': 'https://github.com/minbrowser/min/releases/download/v1.16.0/min-1.16.0-setup.exe',
  'WOW64': 'https://github.com/minbrowser/min/releases/download/v1.16.0/min-1.16.0-setup.exe',
  // neither of the 64-bit strings matched, fall back to 32-bit
  'Windows NT': 'https://github.com/minbrowser/min/releases/download/v1.16.0/Min-v1.16.0-win32-ia32.zip'
}

function getDownloadLink () {
  var downloadLink = null

  for (var platform in platformMatchStrings) {
    if (navigator.platform.indexOf(platform) !== -1) {
      downloadLink = platformMatchStrings[platform]
      break
    }
  }

  if (!downloadLink) {
    for (var ua in UAMatchStrings) {
      if (navigator.userAgent.indexOf(ua) !== -1) {
        downloadLink = UAMatchStrings[ua]
        break
      }
    }
  }

  // android often reports linux as the platform, but we don't have an android download

  if (navigator.userAgent.indexOf('Android') !== -1) {
    downloadLink = null
  }

  return downloadLink
}

function setupDownloadButton (button) {
  var downloadLink = getDownloadLink()

  if (downloadLink instanceof Object) {
    // we have a deb and an rpm link
    button.parentElement.removeAttribute('href')
    button.addEventListener('click', function () {
      showLinuxDialog(downloadLink)
    })
  } else if (downloadLink) {
    // we have a single download link
    button.parentElement.href = downloadLink

    // show gatekeeper instruction popup
    if (navigator.platform === 'MacIntel') {
      button.addEventListener('click', function () {
        setTimeout(showMacDialog, 500)
      }, false)
    }
  } else {
    button.parentElement.href = 'https://github.com/minbrowser/min/releases/latest'
    button.classList.add('disabled')
    button.getElementsByClassName('button-label')[0].textContent = failMessage

    var subtext = document.createElement('span')
    subtext.className = 'button-subtext'
    subtext.textContent = 'Download anyway >>'
    button.appendChild(subtext)
  }
}

var downloadButtons = document.getElementsByClassName('download-button')

for (var i = 0; i < downloadButtons.length; i++) {
  setupDownloadButton(downloadButtons[i])
}
