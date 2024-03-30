// Access the webcam and display video stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        var video = document.getElementById('video');
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.log("An error occurred: " + err);
    });

// Capture image from the video stream
var captureBtn = document.getElementById('capture-btn');
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

captureBtn.addEventListener('click', function() {
    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current frame from video onto canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas content to base64 data URL
    var imageData = canvas.toDataURL('image/png');

    // Log the captured image data (for debugging)
    console.log("Captured Image Data:", imageData);

    // Create a FormData object to send the image data
    var formData = new FormData();
    formData.append('imageData', imageData);

    // Send the image data to the backend using AJAX
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/process_image', true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Image successfully sent to the backend
            var response = JSON.parse(xhr.responseText);
            var emotion = response.emotion;
            var song = response.song;
            document.getElementById('emotion-display').innerText = 'Detected Emotion: ' + emotion;
            // Play the corresponding song
            var audio = document.getElementById('music-player');
            audio.src = song;
            audio.play(); // Play the audio
        } else {
            // Error handling
            console.log('Error sending image to the backend');
            document.getElementById('emotion-display').innerText = 'Error: Image not processed';
        }
    };
    xhr.onerror = function() {
        // Error handling
        console.log('Error sending image to the backend');
        document.getElementById('emotion-display').innerText = 'Error: Image not processed';
    };
    xhr.send(formData);
});

// Function to display animation based on detected emotion
function displayAnimation(animation) {
    var animationContainer = document.getElementById('animation-container');
    animationContainer.innerHTML = ''; // Clear previous animation

    if (animation) {
        animationContainer.innerHTML = '<div class="' + animation + '">😊</div>'; // Display animation
    }
}
