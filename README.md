# 💻 Frontend-applications
For this course I will learn how to create visualisations from external data. This data will then be visualized in D3. The website will be made with React.

## Debriefing
![test](img/volkskrant.svg)

## ⭐️ Design Challenge
**Subject: The car in the city**

How do different municipalities and places deal with parking within the city?

We are going to deliver an interactive data visualization. We must have a good title with a good description. Building is done with a front-end framework. The datavisualisation has to be rendered with D3.

## 📝 Concept

> **Is there a connection between the number of parking spots and province?**

### 🤔 Assumptions
I assume that Noord-Holland will be having the highest average parking spots since Amsterdam has the most population dense city of the Netherlands.

## ⌗ Data I need

- Number of parking garages per province
[I will be needing the unique identifier of the garages](https://npropendata.rdw.nl/parkingdata/v2/). The way this dataset works is that every garage contains a unique id. If I fetch all the unique id's from the API and look up the data I can find in which province each garage is located at.

An unique id looks like this: `"fc749565-1fe9-42f0-920a-3b4e718d62f9"`. 

I then can request the data by inputting this as URL:
`https://npropendata.rdw.nl/parkingdata/v2/fc749565-1fe9-42f0-920a-3b4e718d62f9`

After having downloaded the information of each garage, I cleaned the data and created a new .json file. There are 910 garages. Every garage now contains 4 keys of data:

```js
//example of first object in the array
0: {
    capacity: 22,
    id: "fc749565-1fe9-42f0-920a-3b4e718d62f9",
    name: "P+R Station Appingedam (Appingedam)",
    province: "Groningen"
}
```

## How do I install this project?
Install the project:
```
npm install
```
## How do I run this project?
To run this project:
```
npm run start
```

## Live link of the project
[Live link of the project](https://relaxed-panini-67bcc0.netlify.app/)

## Credits and License
Shoutout to Sam and Ralf for helping me out here and there.
This project has a MIT license.

