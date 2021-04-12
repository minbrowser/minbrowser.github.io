function showDialogBackdrop () {
  var backdrop = document.createElement('div')
  backdrop.className = 'backdrop'
  document.body.appendChild(backdrop)
  backdrop.addEventListener('click', function () {
    backdrop.parentNode.removeChild(backdrop)
    var dialog = document.querySelector('.dialog')
    dialog.parentNode.removeChild(dialog)
  })
}

var sponsorMessage = '\
<div\
    style="box-shadow: 1px 0 10px 0 rgba(0,0,0,0.3);padding: 1em 3em;margin-left: -0.75em;margin-right: -0.75em;margin-top: 2em;border-radius: 6px;">\
    <h2 style="margin-bottom: 0.25em;margin-top: 0;"><i class="i carbon:favorite"\
            style="color: #ff0759;margin-left: -38px;margin-right: 12px;vertical-align: text-top;"></i>Help support Min\
    </h2>By contributing, you\'ll help Min continue receiving new features and updates. You can also be listed as a sponsor and have priority support.<br><a style="margin-top: 1em; display: inline-block;"\
        href="https://github.com/sponsors/PalmerAL" target="_blank">Sponsor on GitHub <i class="i carbon:caret-right"\
            style="font-size: 1.3em;vertical-align: text-top;margin-top: -2px;display: inline-block;margin-left: -2px;"></i></a>\
</div>\
'

function showMacDialog () {
  showDialogBackdrop()

  var dialog = document.createElement('div')
  dialog.className = 'dialog centered'
  dialog.innerHTML = '<h2>How to install</h2>\
  <ul>\
    <li>Drag Min from your Downloads folder to the Applications folder.</li>\
    <li>Right click on Min.</li>\
    <li>Choose "Open".</li>\
    <li>If a warning dialog is shown, choose "Open".</li>\
  </ul>' + sponsorMessage

  document.body.appendChild(dialog)
}

function showWindowsDialog () {
  showDialogBackdrop()

  var dialog = document.createElement('div')
  dialog.className = 'dialog centered'
  dialog.innerHTML = '<h2>How to install</h2>\
  <ul>\
    <li>Start the installer.</li>\
    <li>If a warning dialog is shown, choose "More Info".</li>\
    <li>Choose "Run Anyway".</li>\
    <li>Wait for Min to open.</li>\
  </ul>' + sponsorMessage

  document.body.appendChild(dialog)
}

function showLinuxDialog (downloadLinks) {
  showDialogBackdrop()

  var dialog = document.createElement('div')
  dialog.className = 'dialog centered'
  dialog.innerHTML = '\
  <h3> For Debian-based distributions:</h3>\
  <a id="download-deb-link"><button class="button outlined-button outlined-button-white" style="display: block; margin: auto">Download .deb</button></a>\
  <div>Install with <pre style="display: inline-block; margin-left: 0.5em">sudo dpkg -i /path/to/download</pre> </div>\
  <h3> For RPM-based distributions:</h3>\
  <a id="download-rpm-link"><button id="download-rpm-button" class="button outlined-button outlined-button-white" style="display: block; margin: auto">Download .rpm</button></a>\
  <div>Install with <pre style="display: inline-block; margin-left: 0.5em">sudo rpm -i /path/to/download --ignoreos</pre> </div>\
  ' + sponsorMessage

  dialog.querySelector('#download-deb-link').href = downloadLinks.deb
  dialog.querySelector('#download-rpm-link').href = downloadLinks.rpm

  document.body.appendChild(dialog)
}

/* check if Min is available for the user's computer */

var failMessage = "Min isn't supported on your OS"

// matches against navigator.platform
var platformMatchStrings = {
  MacIntel: 'https://github.com/minbrowser/min/releases/download/v1.19.1/Min-v1.19.1-darwin-x64.zip',
  // electron no longer supports 32-bit linux (https://electronjs.org/blog/linux-32bit-support), so there's only a 64-bit build available
  // 'Linux aarch64': 'https://github.com/minbrowser/min/releases/download/v1.19.1/min_1.19.1_armhf.deb',
  // this could be either 32- or 64- bit, but we only have 64-bit downloads, so just display that and hope it works
  Linux: {
    // there isn't an obvious way to detect deb- or rpm-based systems
    deb: 'https://github.com/minbrowser/min/releases/download/v1.19.1/min_1.19.1_amd64.deb',
    rpm: 'https://github.com/minbrowser/min/releases/download/v1.19.1/min-1.19.1-1.x86_64.rpm'
  }
}

// matches against navigator.userAgent
var UAMatchStrings = {
  Win64: 'https://github.com/minbrowser/min/releases/download/v1.19.1/min-1.19.1-setup.exe',
  WOW64: 'https://github.com/minbrowser/min/releases/download/v1.19.1/min-1.19.1-setup.exe',
  // neither of the 64-bit strings matched, fall back to 32-bit
  // there currently aren't any 32-bit windows builds, so just use the 64-bit installer anyway
  'Windows NT': 'https://github.com/minbrowser/min/releases/download/v1.19.1/min-1.19.1-setup.exe'
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
    } else if (navigator.platform === 'Win32') {
      button.addEventListener('click', function () {
        setTimeout(showWindowsDialog, 500)
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
