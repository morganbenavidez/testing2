from flask import Flask, render_template, send_from_directory, request, jsonify
from summit import summit
import os

app = Flask(__name__)

print('hello')
# Root path for lesson storage
LESSONS_DIR = 'LESSONS'

# Ensure LESSONS folder exists
os.makedirs(LESSONS_DIR, exist_ok=True)



@app.route('/summit/<path:filename>')
def summit_static(filename):
    return send_from_directory('summit', filename)



# EDIT ANYTHING YOU WANT AFTER HERE

@app.route('/documentation')
def documentation():
    page = request.args.get('page', 'documentation')
    return render_template('index.html', page=page)

@app.route('/')
def home():
    page = request.args.get('page', 'home')
    return render_template("index.html", page=page)

@app.route('/create_lesson', methods=['POST'])
def create_lesson():

    data = request.json
    lesson_name = data.get('lessonName')
    topic_description = data.get('topicDescription')

    if not lesson_name or not topic_description:
        return jsonify({'error': 'Missing fields'}), 400

    # Create a subfolder for the lesson
    lesson_folder = os.path.join(LESSONS_DIR, lesson_name)
    os.makedirs(lesson_folder, exist_ok=True)

    chat_prompt = "Create a bulleted lesson plan to teach the topic: " + topic_description + """ 
    Your response should be very simple html. I want 
    """


    gpt_response = summit.gpt_connection(chat_prompt, OPEN_AI_KEY)

    # Generate lesson content by calling ChatGPT (mocked here)
    lesson_content = f"<html><body><h1>{lesson_name}</h1><p>{topic_description}</p></body></html>"

    # Save lesson content as an HTML file
    lesson_file_path = os.path.join(lesson_folder, 'Lesson_1.html')
    with open(lesson_file_path, 'w') as file:
        file.write(lesson_content)

    # Get all subfolders in LESSONS and sort them alphabetically
    subfolders = sorted([name for name in os.listdir(LESSONS_DIR) if os.path.isdir(os.path.join(LESSONS_DIR, name))])

    return jsonify({'message': 'Lesson created successfully', 'subfolders': subfolders})


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)
