/*!
 * SaveMySnip! - Making screenshots a little easier
 *
 * Author: Tanner Harkin
 * Copyright: 2023 Tanner Harkin. All rights reserved.
 * Description: Main functionality for SaveMySnip! including image paste and save operations.
 * Version: v1.0
 */

let idleTimeout;

document.addEventListener('paste', function(event) {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            const imageUrl = URL.createObjectURL(blob);
            const pastedImage = document.getElementById('pastedImage');
            const saveButton = document.getElementById('saveButton');
            pastedImage.src = imageUrl;
            pastedImage.style.opacity = '1';
            pastedImage.style.display = 'block';
            saveButton.style.opacity = '1';
            saveButton.style.display = 'inline-block';
            hideInstructions();
            resetIdleTimeout();
            break;
        }
    }
});

function saveImage() {
    const image = document.getElementById('pastedImage');
    const link = document.createElement('a');
    link.download = 'screenshot.png';
    link.href = image.src;
    link.click();
    resetIdleTimeout();
}

function hideInstructions() {
    const instructionDiv = document.getElementById('instruction');
    instructionDiv.style.opacity = '0';
    instructionDiv.style.maxHeight = '0';

    setTimeout(() => {
        document.getElementById('logo').style.opacity = '0.15';
    }, 250);

    setTimeout(() => {
        instructionDiv.removeEventListener('click', hideInstructions);
    }, 5000);
}

function resetIdleTimeout() {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
        const pastedImage = document.getElementById('pastedImage');
        const saveButton = document.getElementById('saveButton');
        pastedImage.style.opacity = '0';
        saveButton.style.opacity = '0';

        setTimeout(() => {
            pastedImage.src = '';
            pastedImage.style.display = 'none';
            saveButton.style.display = 'none';
        }, 1000);
    }, 15000);
}

setTimeout(() => {
    document.getElementById('footer').style.opacity = '0';
}, 30000);

function getFullLanguageCode(shortCode) {
    const mappings = {
        'en': 'en-US',
        'es': 'es-ES',
        'zh': 'zh-CN',
        'hi': 'hi-IN',
        'pt': 'pt-PT',
        'bn': 'bn-BD',
        'ru': 'ru-RU',
        'ja': 'ja-JP',
        'pa': 'pa-IN',
        'ko': 'ko-KR'
    };

    return mappings[shortCode] || shortCode;
}

window.addEventListener('DOMContentLoaded', (event) => {
    const defaultLang = "en-US";
    const userLang = getFullLanguageCode(navigator.language || navigator.languages[0] || defaultLang);

    if (userLang !== defaultLang && userLang.match(/^[a-z]{2}-[A-Z]{2}$/)) {
        fetch(`translations/${userLang}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status} - Failed to fetch translations for ${userLang}.`);
                }
                return response.json();
            })
            .then(data => {
                if (typeof data === "object") {
                    const translationElements = document.querySelectorAll('[data-translate-key]');
                    translationElements.forEach(element => {
                        const key = element.getAttribute('data-translate-key');
                        if (data[key]) {
                            element.innerHTML = data[key];
                        }
                    });
                } else {
                    throw new Error(`Received data for ${userLang} is not in the expected format.`);
                }
            })
            .catch(error => {
                console.log(`The website will use the default English text due to:`, error.message);
            });
    }
});

resetIdleTimeout();
