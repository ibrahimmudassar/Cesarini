from flask import Flask, request, jsonify, Response
from weatherget import get_probabilistic_weather, llm
from flask_cors import CORS, cross_origin
from datetime import datetime
import json
from random import choice

app = Flask(__name__)
CORS(app)

cache = {}


@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        res = Response()
        res.headers["X-Content-Type-Options"] = "*"
        return res


@app.route("/", methods=["POST"])
@cross_origin()
def get_score():
    print(request.json)
    answer = request.json

    latitude = round(answer["latitude"], 2)
    longitude = round(answer["longitude"], 2)

    is_in_cache = (False, None)
    for i in cache:
        if (
            i[0] == "historical"
            and i[1] == latitude
            and i[2] == longitude
            and (datetime.now() - i[3]).total_seconds() < 60 * 15
        ):
            is_in_cache = (True, i)
            break

    if not is_in_cache[0]:
        llm_raw = llm()[8:-3]
        # llm_raw = llm_raw[:]
        llm_data = json.loads(llm_raw)

        now = datetime.now()
        answer = get_probabilistic_weather(latitude=latitude, longitude=longitude)
        cache[("historical", latitude, longitude, now)] = answer | llm_data
        print("data")
        return cache[("historical", latitude, longitude, now)]
    else:
        print("cache")
        return cache[is_in_cache[1]]

    # return get_probabilistic_weather(latitude=latitude, longitude=longitude)
    # return cache[(latitude, longitude)]


@app.route("/crowdsource_question", methods=["GET"])
def crowdsource_question():
    questions = [
        {"type": "rain", "question": "Is it raining right now?"},
        {
            "type": "snow",
            "question": "How many inches of snow on the ground right now?",
        },
        {"type": "wind", "question": "Is it less/same/more windy than reported?"},
        {"type": "temperature", "question": "Is it colder/same/hotter than reported?"},
    ]

    return choice(questions)


@app.route("/crowdsource_answer", methods=["POST"])
def crowdsource_answer():
    return


@app.route("/", methods=["GET"])
def hello():

    latitude = 40.522
    longitude = -74.436

    if (latitude, longitude) not in cache:
        llm_raw = llm()[8:-3]
        llm_data = json.loads(llm_raw)
        answer = get_probabilistic_weather(latitude=latitude, longitude=longitude)
        cache[(latitude, longitude)] = answer | llm_data
        print("data")
    else:
        print("cache")

    # return get_probabilistic_weather(latitude=latitude, longitude=longitude)
    return cache[(latitude, longitude)]
