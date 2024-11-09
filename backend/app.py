from flask import Flask, request, jsonify, Response
from weatherget import get_probabilistic_weather
from flask_cors import CORS, cross_origin
from datetime import datetime


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

    latitude = answer["latitude"]
    longitude = answer["longitude"]

    is_in_cache = (False, None)
    for i in cache:
        if (
            i[0] == latitude
            and i[1] == longitude
            and (datetime.now() - i[2]).total_seconds() < 3600
        ):
            is_in_cache = (True, i)
            break

    if not is_in_cache[0]:
        now = datetime.now()
        answer = get_probabilistic_weather(latitude=latitude, longitude=longitude)
        cache[(latitude, longitude, now)] = answer
        print("data")
        return cache[(latitude, longitude, now)]
    else:
        print("cache")
        return cache[is_in_cache[1]]

    # return get_probabilistic_weather(latitude=latitude, longitude=longitude)
    # return cache[(latitude, longitude)]


# @app.route("/", methods=['GET'])
# def get_default_score():

#     latitude = 40.522
#     longitude = -74.436

#     if (latitude, longitude) not in cache:
#         answer = get_probabilistic_weather(
#             latitude=latitude, longitude=longitude)
#         cache[(latitude, longitude)] = answer
#         print("data")
#     else:
#         print("cache")

#     # return get_probabilistic_weather(latitude=latitude, longitude=longitude)
#     return cache[(latitude, longitude)]
