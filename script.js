let dictionary;

async function loadDictionary() {

    const aff = await fetch('typo/dictionaries/en_US/en_US.aff').then(response => response.text());
    const dic = await fetch('typo/dictionaries/en_US/en_US.dic').then(response => response.text());

    dictionary = new Typo('en_US', aff, dic, { platform: 'any' });
}

function checkSpelling() {
    const textInput = document.getElementById('text-input');
    const text = textInput.innerText;
    const words = text.split(/\s+/);
    let highlightedText = '';

    words.forEach(word => {
        // Match base words including contractions and trailing punctuation separately
        const match = word.match(/^([a-zA-Z']+)([.,!?;]*)$/);

        if (match) {
            const baseWord = match[1];
            const punctuation = match[2];

            if (dictionary.check(baseWord)) {
                highlightedText += baseWord + punctuation + ' ';
            } else {
                highlightedText += `<span class="misspelled" onclick="showSuggestions('${baseWord}')">${baseWord}</span>${punctuation} `;
            }
        } else {
            highlightedText += word + ' ';
        }
    });

    textInput.innerHTML = highlightedText.trim();
}

function showSuggestions(word) {
    const suggestionsDiv = document.getElementById('suggestions');
    const suggestions = dictionary.suggest(word);
    
    if (suggestions.length > 0) {
        let suggestionsHTML = `<strong>Suggestions for "${word}":</strong><ul>`;
        suggestions.forEach(suggestion => {
            suggestionsHTML += `<li class="suggestion-item" onclick="replaceWord('${word}', '${suggestion}')">${suggestion}</li>`;
        });
        suggestionsHTML += '</ul>';
        suggestionsDiv.innerHTML = suggestionsHTML;
    } else {
        suggestionsDiv.innerHTML = `<strong>No suggestions for "${word}"</strong>`;
    }
}

function replaceWord(oldWord, newWord) {
    const textInput = document.getElementById('text-input');
    const text = textInput.innerHTML;
    const updatedText = text.replace(new RegExp(`\\b${oldWord}\\b`, 'g'), newWord);
    textInput.innerHTML = updatedText;
    document.getElementById('suggestions').innerHTML = '';
}

window.onload = loadDictionary;
