from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key="fresed-dI7xaGFzDKkBLx9kKzmd0YJ4JZZ9X8",
    base_url="https://fresedgpt.space/v1",
)

# Describe the weather given: Temperature: 72°F, Rain Probability: 30% using poetry in 1 sentence. output the text in json with 1 key called 'message'. include the temperature and rain probability
async def test_create_chat_completion():
    stream = await client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "give me 6 emojis to fully describe this day: Temperature: 72°F, Rain Probability: 30%. only give me the 6 emojis and output the text in json with 1 key called 'message'",
            }
        ],
        model="gpt-4o-mini",
        stream=True,
    )

    async for chunk in stream:
        print(chunk.choices[0].delta.content or "", end="")


if __name__ == "__main__":
    import asyncio

    asyncio.run(test_create_chat_completion())
