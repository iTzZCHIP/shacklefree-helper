chrome.action.onClicked.addListener((tab) => {
    const url = tab.url;
    chrome.tabs.create({ url: "https://www.shacklefree.in" }, function (newTab) {
        chrome.tabs.onUpdated.addListener(async function onTabUpdated(tabId, changeInfo, tab) {
            if (tabId === newTab.id && changeInfo.status === 'complete') {
                await chrome.scripting.executeScript({
                    target: { tabId: newTab.id },
                    function: simulateTyping,
                    args: [url]
                });

                await chrome.scripting.executeScript({
                    target: { tabId: newTab.id },
                    function: clickReadButton,
                });

                chrome.tabs.onUpdated.removeListener(onTabUpdated);
            }
        });
    });
});

function simulateTyping(url) {
    const textField = document.getElementById('url');

    if(!textField) {
        throw new Error("Textfeld nicht gefunden !");
    }

    textField.focus()

    url.split('').forEach(char => {
        const keyDownEvent = new KeyboardEvent('keydown', { 'key': char });
        textField.dispatchEvent(keyDownEvent);

        const keyUpEvent = new KeyboardEvent('keyup', { key: char });
        textField.dispatchEvent(keyUpEvent);

        const inputEvent = new Event('input', { bubbles: true, cancelable: true });
        textField.value += char;
        textField.dispatchEvent(inputEvent);
    })
}

function clickReadButton() {
    const button = document.querySelector('button[type="submit"].chakra-button');

    if (!button) {
        throw new Error("Button nicht gefunden !");
    }

    button.click();
}


