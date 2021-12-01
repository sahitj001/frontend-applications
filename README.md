# 💻 Frontend-applications
For this course I will learn how to create visualisations from external data. This data will then be visualized in D3. The website will be made with React.

## 📩 Debriefing
![test](img/vk.png)

De Volkskrant requested the students of the Tech Track to find interesting insights regarding the car in the city. The subject is broad and we can choose what concept we will be building as long as it relates to the car in the city. The datasets we have to use are mainly from the [RDW](https://www.rdw.nl/). However, we are free to use other datasets as long as they are part of the main subject. Based on our datavisualisations, De Volkskrant might use this information to write an interesting article.

## ⭐️ Design Challenge
**Subject: The car in the city**

How do different municipalities and places deal with parking within the city?

We are going to deliver an interactive data visualization. We must have a good title with a good description. Building is done with a front-end framework. The datavisualisation has to be rendered with D3.

## 📝 Concept

> **Is there a connection between the number of parking spots and province?**

![product video](https://imgur.com/a/U9lUV4F)

We are going to take a look at three views on my bar chart:

- Total parking capacity per province
- Average parking capacity per province
- Show which province has the biggest parking garage by showing the highest parking capacity of that garage.

Through these views, I was able to find interesting research questions.
### 🧪 Research questions

Based on my datavisualisation I made two research questions:

- Why do the top 4 cities have almost the same avarage parking capacity?

According to a report of the Ministerie van Infrastructuur en Waterstaat, I found that most public parking garages are built in the bigger cities. I think that there is a connection between population density and average parking capacity. It is optimal to have around the 300 parking spots per parking garage in each capital city of Groningen, Flevoland, Zuid-holland and Noord-holland.

- Zuid-Holland has the most total parking spots per province by a large margin. But if you look at the average, you notice that it contains about as much average parking capacity as Flevoland, Noord-Holland and Groningen. Is there a specific reason for that?

The reason that Zuid-Holland has way more parking garages than all the other provinces, is because of urban construction plans. According to the government website of Zuid-Holland there were a lot of parking garages built because there is a municipal parking norm that has to be adhered. According to the parking norm, for each house that is built, there has to be a number of parking spots built. Because there are so much parking garages, Zuid-Holland is suffering from structully vacant parking garages.

Because of such a low demand of parking garages, many projects are delayed or completely canceled. These projects have to adhere to the parking norms. Building these garages won't be profitable for the investors.
## ⌗ Data I need

- Number of parking garages per province
[I will be needing the unique identifier of the garages](https://npropendata.rdw.nl/parkingdata/v2/). The way this dataset works is that every garage contains a unique id. If I fetch all the unique id's from the API and look up the data I can find in which province each garage is located at.

An unique id looks like this: `"fc749565-1fe9-42f0-920a-3b4e718d62f9"`. 

I then can request the data by inputting this as URL:
`https://npropendata.rdw.nl/parkingdata/v2/static/fc749565-1fe9-42f0-920a-3b4e718d62f9`

Through Sam's help, I was able to get the data from all the parking garages downloaded. The next step was to clean up the data. Some garages didn't contain a parking capacity so I had to filter those out.

I then created a new json file that contains 910 garages. Every garage now contains 4 keys of data:

```js
//example of first object in the array
0: {
    capacity: 22,
    id: "fc749565-1fe9-42f0-920a-3b4e718d62f9",
    name: "P+R Station Appingedam (Appingedam)",
    province: "Groningen"
}
```

## 📦 How do I install this project?
Install the project:
```
npm install
```
## ▶️ How do I run this project?
To run this project:
```
npm run start
```

## 🔗 Live link of the project
[Live link of the project](https://relaxed-panini-67bcc0.netlify.app/)

## ⚖️ Credits and License
Shoutout to Sam and Ralf for helping me out here and there.
This project has a MIT license.

