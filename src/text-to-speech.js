const textToSpeechButton = document.querySelector('.tts-voices-button');
const voicesDropdown = document.querySelector('.tts-voices-dropdown');
const playButton = document.querySelector('.tts-play-button');
const pauseButton = document.querySelector('.tts-pause-button');
const noteContentText = document.querySelector('.note-content');

let voices = [];
let selectedVoice = null;
let utterance = null;

function populateVoices() {
    voices = speechSynthesis.getVoices();
    voicesDropdown.innerHTML = '';
    voices.forEach((voice, index) => {
        const voiceOption = document.createElement('div');
        voiceOption.textContent = `${voice.name} (${voice.lang})`;
        voiceOption.setAttribute('data-voice-index', index);
        voicesDropdown.appendChild(voiceOption);
    });
}

textToSpeechButton.addEventListener('click', function() {
    if (voicesDropdown.style.display === 'none' || voicesDropdown.style.display === '') {
        populateVoices();
        voicesDropdown.style.display = 'block';
    } else {
        voicesDropdown.style.display = 'none';
    }
});

voicesDropdown.addEventListener('click', function(event) {
    if (event.target && event.target.nodeName === 'DIV') {
        const index = event.target.getAttribute('data-voice-index');
        selectedVoice = voices[index];
        voicesDropdown.style.display = 'none';
    }
});

playButton.addEventListener('click', function() {
    if (utterance) {
        speechSynthesis.resume();
        playButton.style.display = 'none';
        pauseButton.style.display = 'block';
    } else if (selectedVoice && noteContentText.value.trim()) {
        utterance = new SpeechSynthesisUtterance(noteContentText.value.trim());
        utterance.voice = selectedVoice;
        utterance.onstart = function() {
            playButton.style.display = 'none';
            pauseButton.style.display = 'block';
        };
        utterance.onend = function() {
            playButton.style.display = 'block';
            pauseButton.style.display = 'none';
            utterance = null;
        };
        speechSynthesis.speak(utterance);
    }
});

pauseButton.addEventListener('click', function() {
    if (utterance) {
        speechSynthesis.pause();
        utterance.onend = null;
        playButton.style.display = 'block';
        pauseButton.style.display = 'none';
    }
});

document.addEventListener('click', function(event) {
    if (!textToSpeechButton.contains(event.target) && !voicesDropdown.contains(event.target)) {
        voicesDropdown.style.display = 'none';
    }
});

speechSynthesis.onvoiceschanged = populateVoices;
