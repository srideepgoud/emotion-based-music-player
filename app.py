from flask import Flask, request, jsonify, render_template
from deepface import DeepFace
import base64

app = Flask(__name__)

# Define a mapping of emotions to songs and animations
emotion_data = {
    'happy': {'song': 'static/JamalKudu.mp3', 'animation': 'happy-animation'},
    'sad': {'song': 'static/JamalKudu.mp3', 'animation': 'sad-animation'},
    'angry': {'song': 'static/JamalKudu.mp3', 'animation': 'angry-animation'},
    'neutral': {'song': 'static/JamalKudu.mp3', 'animation': 'neutral-animation'},
    # Add more emotions and corresponding data as needed
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process_image', methods=['POST'])
def process_image():
    try:
        # Get image data from the request
        image_data = request.form['imageData']
        
        # Decode base64 image data
        image_bytes = base64.b64decode(image_data.split(',')[1])

        # Save the image locally
        image_path = 'static/captured_image.png'
        with open(image_path, 'wb') as f:
            f.write(image_bytes)

        # Perform emotion detection using DeepFace
        result = DeepFace.analyze(img_path=image_path)
        emotion = result[0]['dominant_emotion']

        # Lookup the corresponding song and animation for the detected emotion
        data = emotion_data.get(emotion)
        if data:
            return jsonify({'emotion': emotion, 'song': data['song'], 'animation': data['animation']}), 200
        else:
            return 'No data found for the detected emotion', 200
    except Exception as e:
        app.logger.error(f"Error processing image: {e}")
        return 'An error occurred while processing the image', 500

if __name__ == '__main__':
    app.run(debug=True)
