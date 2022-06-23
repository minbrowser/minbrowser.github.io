function showDialogBackdrop () {
  var backdrop = document.createElement('div')
  backdrop.className = 'backdrop'
  document.body.appendChild(backdrop)
  backdrop.addEventListener('click', function () {
    backdrop.parentNode.removeChild(backdrop)
    var dialogs = Array.from(document.querySelectorAll('.dialog'))
    dialogs.forEach(dialog => dialog.remove())
  })
}

var sponsorMessage = `
<div
    style="box-shadow: 1px 0 10px 0 rgba(0,0,0,0.3);padding: 1em 3em;margin-left: -0.75em;margin-right: -0.75em;margin-top: 2em;border-radius: 6px;">
    <h2 style="margin-bottom: 0.25em;margin-top: 0;"><i class="i carbon:favorite"
            style="color: #ff0759;margin-left: -38px;margin-right: 12px;vertical-align: text-top;"></i>Help support Min
    </h2>By contributing, you'll help Min continue receiving new features and updates. You can also be listed as a sponsor and have priority support.<br><a style="margin-top: 1em; display: inline-block;"
        href="https://github.com/sponsors/PalmerAL" target="_blank">Sponsor on GitHub <i class="i carbon:caret-right"
            style="font-size: 1.3em;vertical-align: text-top;margin-top: -2px;display: inline-block;margin-left: -2px;"></i></a>
</div>
`

function showMacStageOneDialog (downloadLinks) {
  showDialogBackdrop()

  var dialog = document.createElement('div')
  dialog.className = 'dialog centered'
  dialog.innerHTML = `
  <h3> Pick the version of Min that's right for your Mac: </h3>
  <a id="download-mac-intel"><button class="button outlined-button outlined-button-white" style="display: block; margin: auto">Intel Mac</button></a>
  <br>
  <a id="download-mac-arm"><button class="button outlined-button outlined-button-white" style="display: block; margin: auto">Apple Silicon Mac</button></a>
  <br/>
  <div style="margin-top:0.25em"><a href="https://support.apple.com/en-us/HT211814" target="_blank">What kind of Mac do I have?</a></div>
  `

  dialog.querySelector('#download-mac-intel').href = downloadLinks.intel
  dialog.querySelector('#download-mac-arm').href = downloadLinks.arm

  dialog.querySelector('#download-mac-intel').addEventListener('click', showMacStageTwosDialog)
  dialog.querySelector('#download-mac-arm').addEventListener('click', showMacStageTwosDialog)

  document.body.appendChild(dialog)
}

function showMacStageTwosDialog () {
  var dialog = document.createElement('div')
  dialog.className = 'dialog centered'
  dialog.innerHTML = `<h2>How to install</h2>
  <ul>
    <li>Drag Min from your Downloads folder to the Applications folder.</li>
    <li>Right click on Min.</li>
    <li>Choose "Open".</li>
    <li>If a warning dialog is shown, choose "Open".</li>
  </ul>` + sponsorMessage

  document.body.appendChild(dialog)
}

function showWindowsDialog () {
  showDialogBackdrop()

  var dialog = document.createElement('div')
  dialog.className = 'dialog centered'
  dialog.innerHTML = `<h2>How to install</h2>
  <ul>
    <li>Start the installer.</li>
    <li>If a warning dialog is shown, choose "More Info".</li>
    <li>Choose "Run Anyway".</li>
    <li>Wait for Min to open.</li>
  </ul>` + sponsorMessage

  document.body.appendChild(dialog)
}

function showLinuxDialog (downloadLinks) {
  showDialogBackdrop()

  var dialog = document.createElement('div')
  dialog.className = 'dialog centered'
  dialog.innerHTML = `
  <h3> For Debian-based distributions:</h3>
  <a id="download-deb-link"><button class="button outlined-button outlined-button-white" style="display: block; margin: auto">Download .deb</button></a>
  <div>Install with <pre style="display: inline-block; margin-left: 0.5em">sudo dpkg -i /path/to/download</pre> </div>
  <h3> For RPM-based distributions:</h3>
  <a id="download-rpm-link"><button id="download-rpm-button" class="button outlined-button outlined-button-white" style="display: block; margin: auto">Download .rpm</button></a>
  <div>Install with <pre style="display: inline-block; margin-left: 0.5em">sudo rpm -i /path/to/download --ignoreos</pre> </div>
  ` + sponsorMessage

  dialog.querySelector('#download-deb-link').href = downloadLinks.deb
  dialog.querySelector('#download-rpm-link').href = downloadLinks.rpm

  document.body.appendChild(dialog)
}

/* check if Min is available for the user's computer */

var failMessage = "Min isn't supported on your OS"

var downloadLinks = {
  mac: {
    intel: 'https://github.com/minbrowser/min/releases/download/v1.25.0/min-v1.25.0-mac-x86.zip',
    arm: 'https://github.com/minbrowser/min/releases/download/v1.25.0/min-v1.25.0-mac-arm64.zip'
  },
  linux: {
    deb: 'https://github.com/minbrowser/min/releases/download/v1.25.0/min-1.25.0-amd64.deb',
    rpm: 'https://github.com/minbrowser/min/releases/download/v1.25.0/min-1.25.0-x86_64.rpm'
  },
  windows: 'https://github.com/minbrowser/min/releases/download/v1.25.0/min-1.25.0-setup.exe'
}

function getUserPlatform () {
  if (navigator.platform === 'MacIntel') {
    return 'mac'
  }
  if (navigator.platform.toLowerCase().includes('linux')) {
    return 'linux'
  }
  if (navigator.userAgent.toLowerCase().includes('win64') || navigator.userAgent.toLowerCase().includes('wow64') || navigator.userAgent.toLowerCase().includes('windows')) {
    return 'windows'
  }

  return null
}

function getDownloadLinks (userPlatform) {
  return downloadLinks[userPlatform]
}

function setupDownloadButton (button) {
  var userPlatform = getUserPlatform()
  var downloadLinkOrLinks = getDownloadLinks(userPlatform)

  if (userPlatform === 'linux') {
    button.parentElement.removeAttribute('href')
    button.addEventListener('click', function () {
      showLinuxDialog(downloadLinkOrLinks)
    })
  } else if (userPlatform === 'mac') {
    button.parentElement.removeAttribute('href')
    button.addEventListener('click', function () {
      showMacStageOneDialog(downloadLinkOrLinks)
    })
  } else if (userPlatform === 'windows') {
    button.parentElement.href = downloadLinkOrLinks
    button.addEventListener('click', function () {
      setTimeout(showWindowsDialog, 500)
    }, false)
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
