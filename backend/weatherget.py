from datetime import datetime, timedelta

import httpx
import plotly.express as px
import polars as pl
from environs import Env
from openai import OpenAI
from scipy.stats import kstest

env = Env()
env.read_env()


def get_probabilistic_weather(longitude: float, latitude: float) -> dict:
    # yesterday date
    end = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    resp = httpx.get(
        f"https://archive-api.open-meteo.com/v1/archive?latitude={latitude}&longitude={longitude}&start_date=1940-01-01&end_date={end}&timezone=UTC&daily=temperature_2m_max"
    )
    print(resp.url)
    try:

        df = pl.from_dict(resp.json()["daily"])
        df = df.with_columns(pl.col("time").str.strptime(pl.Date))  # parses str to date

        # filters by month and day
        # only pick the datetime that has the same day and month but diff year
        population = df.filter(
            (pl.col("time").dt.day() == datetime.now().day)
            & (pl.col("time").dt.month() == datetime.now().month)
        )
        # fig = px.histogram(population.to_pandas(), x="temperature_2m_max")
        # fig.show()

        popmean = pl.mean(population["temperature_2m_max"])
        stddev = population["temperature_2m_max"].std()
        # print(f"Population Mean: {popmean}")
        # print(f"Std Dev: {stddev}")

        # Temperature is generally normally distributed so this is not needed but the code is provided if you want to test whether the data passes normality
        # isnormal = kstest(df["temperature_2m_max"], "norm")
        # # if less than 0.05 then the data is not due to normal dist otherwise normal
        # if isnormal.pvalue < 0.05:
        #     print(f"p-value = {round(isnormal.pvalue, 2)} therefore according to Kolmogorov-Smirnov we have sufficient evidence that this sample data does not come from a normal distribution")

        today = httpx.get(
            f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current_weather=true&hourly=temperature_2m"
        )
        x = today.json()["current_weather"]["temperature"]
        # print(f"Temp Today: {x}")

        zscore = (x - popmean) / stddev
        # print(f"Z Score: {zscore}")

        return {
            "population_mean": popmean,
            "std_dev": stddev,
            "temp_today": x,
            "z_score": zscore,
        }
    except KeyError:
        return {
            "population_mean": 0,
            "std_dev": 0,
            "temp_today": 0,
            "z_score": 0,
        }


def llm():
    client = OpenAI(
        api_key=env("OPENAI_KEY"),
        base_url="https://fresedgpt.space/v1",
    )

    stream = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "give me 6 emojis to fully describe this day: Temperature: 72°F, Rain Probability: 100%. only give me the 6 emojis and output the text in json with a key called 'emojis'. output emojis as 1 string only. Then give me a 1 sentence poetic description of the weather info provided and output in json with a key called 'poetry'. they should all be in 1 json.",
            }
        ],
        model="gpt-4o-mini",
    )

    return stream.choices[0].message.content


# Describe the weather given: Temperature: 72°F, Rain Probability: 30% using poetry in 1 sentence. output the text in json with 1 key called 'message'. include the temperature and rain probability
