function setCopyToClipboardIconToMode1(button) {
    // Set the black "copy to clipboard" button to the copy icon
    var copyButton = document.getElementById(button);
    var copyButtonMode1 = document.getElementById('copyButtonMode1');
    if (copyButton != null && copyButtonMode1 != null) {
        copyButton.innerHTML = copyButtonMode1.innerHTML;
    }
}

// Works in Chrome, Edge and Firefox
function copyToClipboard(divid, button) {
    var copyText = document.getElementById(divid);

    if (copyText != null) {
        navigator.clipboard.writeText(copyText.innerHTML);
    }

    // Flip the copy icon to the tick to show something has happened
    var copyButton = document.getElementById(button);
    var copyButtonMode2 = document.getElementById('copyButtonMode2');
    if (copyButton != null && copyButtonMode2 != null) {
        copyButton.innerHTML = copyButtonMode2.innerHTML;

        // Reset to the original "copy to clipboard" icon after 2 seconds
        setTimeout(setCopyToClipboardIconToMode1.bind(null, button), 2000);
    }
}

function copyToClipboardFocus(button) {
    var copyButton = document.getElementById(button);
    copyButton.style = "fill: blue;"
}

function copyToClipboardBlur(button) {
    var copyButton = document.getElementById(button);
    copyButton.style = "fill: black;"
}

function copyToClipboardKeydown(e, divid, button) {
    if (e.keyCode == 13) {  // ENTER key
        e.preventDefault();
        copyToClipboard(divid, button);
    }
}

function onLoadInitialisation() {
    setCopyToClipboardIconToMode1('copyButtonID_forItemURI');
    setCopyToClipboardIconToMode1('copyButtonID_forResourceURI');
    setCopyToClipboardIconToMode1('copyButtonID_forHelpPageURI');
}