<!-- ABOUT THE PROJECT -->
## About The Project

<img width="316" alt="image" src="https://github.com/user-attachments/assets/c201cc84-96ac-4545-9406-74f8dc025660">
</br>


Climate Conscious Weather. Hyperlocal data powered by Machine Learning. Jumpstart your day with the most up to date weather in your area in an understandable format

Features:
* 60° in the summer ≠ 60° in the winter. Get a 1 sentence summary of what you should expect with your day
* Understand how anamolous today's data is compared to the same day in history
* Crowdsourced weather data so you can be sure your weather is tailored to you

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Sustainability
At the forefront of this app was the idea that most people aren't thinking about global warming enough. We wanted to change that. Since most of us look up the weather everyday, if we could intercede even for less than a second and show you how extreme the weather is today in comparison to today in history, it would insert even just an iota of climate consciousness. At the end of the day, we're a platform our users come to for information, and that's what we seek to provide in the most intuitive way possible. That's why we have a basic and advanced section. For users who would like to see how we calculated the z-score, the individual parameters, or just the weather in celsius, we have you covered!

### Crowdsourcing
#### <100 Users
We're currently using a simple frequency algorithm where the most frequently answered geography will get picked and if it has more than 40% (for the 3 options) and 65% (for the 2 option) response to one of the questions we will show all users in that geography that note. We also want to implement push notifications when we inevitably develop the mobile app.
#### >100 Users
We'll want to use a matrix factorization recommendation algorithm to sort for the most important insights of our model. This will only be useful when we saturate an area with enough users, the users update relatively frequently (≥1 time a day), and they are being (mostly) truthful. We can then recommend the most useful insight at the time. We don't want to show Australians in the heat of the summer a question about snow! See [Twitter community notes](https://communitynotes.x.com/guide/en/about/introduction) and [Netflix Recommendations](https://research.netflix.com/research-area/recommendations)

### Future Radar
No service provides an intuitive way to see some of the happenings in the stratosphere as intuitively as we do. We're focused on making the best visuals in the industry, and we'd love to deliver that in a comprehensible way to all of our users. That's why we'll show you a radar of the rest of the day so you can be assured you're on the lookout for any weather events that might come your way.

### AI
Currently wer're using GPT-4o mini for our LLM. Given a set of parameters like likelihood of precipitation, temperature, and a number of other factors, the LLM gives us a string of emojis that summarizes what our day would look like. Then we also have a quick sentence of anything you should look out for, or if there's something you need to remember to take before leaving the house.

## Roadmap
* mobile app
* better algorithm

<p align="right">(<a href="#readme-top">back to top</a>)</p>
