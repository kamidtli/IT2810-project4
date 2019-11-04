# IT2810 - Project 4 - Group 16

This is a project for the course Web Development (IT2810) at NTNU, fall 2019.

The project can be found INSERT LINK HERE

## Contributors

- [Kim André Midtlid](https://github.com/kamidtli)
- [Eirik Sture](https://github.com/eirsture)
- [Sebastian Aas](https://github.com/SebastianAas)

## Installation

To set up this project and run this website, first clone the project using

`git clone https://gitlab.stud.idi.ntnu.no/IT2810-H19/teams/team-16/project4.git`

and move into the new directory. Then install all the necessary node modules using

`npm install`.

You can then start the application by running

`npm start`,

and then scanning the resulting QR-code in yout Expo-app.


# Functionality

IMDbest is mobile application for finding movies. The app has a large database of movies from many different directors and genres. On IMDbest you can search for movies based on title or director and add them to your watchlist.

## Front end

Homepage
![Homepage](assets/images/Home.PNG)

Watchlist
![Homepage](assets/images/Watchlist.JPG)

Detailed view
![Homepage](assets/images/Watchlist.JPG)

### React Native

In this project we are using React Native as our frontend framework, in combination with Redux and AsyncStorage as the
state management tools.

### [React Native Elements](https://react-native-elements.github.io/react-native-elements/)


React Native Elements makes it easy to create an app by providing finished components. We chose this thirs-party component library because it is well documented, cross-platform and easy to set up. By implementing this, we reduced the development time significantly and created a more streamlined design for our app.


### Redux
We chose to use Redux as a state management library since we had already implemented it in [Project 3](https://gitlab.stud.idi.ntnu.no/IT2810-H19/teams/team-16/project3), and quickly saw the benefits of Redux. We store information such as

* Filter data such as sorting values, active genre, preferred rating and year range.
* Watchlist content.
* Skip-valiue, to allow for dynamic loading of data.

## Backend

We use the same backend as in [Project 3](https://gitlab.stud.idi.ntnu.no/IT2810-H19/teams/team-16/project3), which is based on MongoDB, Express and GraphQL.

#### Search
When you type the name of a movie or a director in the search field, the app executes a GraphQL query called filterMovies to fetch the relevant data.

#### Dynamic loading
When a user scrolls to the bottom a search result page, a query is sent to the backend to request additional data. The response data is rendered at the bottom of the page and the amount of pages visited is increased in the Redux store to ensure consistency. Every time a query for new data is sent, the amout of data currently rendered is passed as an argument to make sure we don't query and show overlapping data. By implementing dynamic loading we reduce the amount of bandwidth needed, and minimize the overall load on the user. In addition to this the request for data executes in a fraction of the time it takes to request all relevant data.

#### Filtering and sorting
The filtering and sorting on the web page is done by the graphql query. The GraphQL query takes in both search value, genre, year range, and rating range, which are used to filter out the wrong data from the dataset. 

The sorting is done by a built-in function from Mongoose, which sorts either alphabetically, by rating or by release date.