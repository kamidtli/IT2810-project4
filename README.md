# IT2810 - Project 4 - Group 16

This is a project for the course Web Development (IT2810) at NTNU, fall 2019.

## Contributors

- [Kim André Midtlid](https://github.com/kamidtli)
- [Eirik Sture](https://github.com/eirsture)
- [Sebastian Aas](https://github.com/SebastianAas)

## Installation

To set up this project and run the app, first clone the project using

`git clone https://gitlab.stud.idi.ntnu.no/IT2810-H19/teams/team-16/project4.git`

and move into the new directory. Then install all the necessary node modules using

`npm install`.

You can then start the application by running

`npm start`,

and scanning the resulting QR-code in your Expo-app ([iOS](https://apps.apple.com/app/apple-store/id982107779), [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www))

## [Expo](https://expo.io/)

The project was initialized in Expo CLI by using the command `expo init`. We decided to use the tabs-template, because we knew we wanted to have two tabs in our app. By choosing a template it made it easier for us to more quickly start development.

### Development

When starting development we wanted to work as effeciently and smoothly as possible. This involved choosing what to reuse from [Project 3](https://gitlab.stud.idi.ntnu.no/IT2810-H19/teams/team-16/project3), as well as which third party libraries and components to use.
We could easily reuse all our Apollo Client, GraphQL and query functionality. This ment we quickly had access to real movie data from the app. By reusing the Redux implementation we could reuse a lot of functionality which search, filtering, pagination and the watchlist was dependent on.
In the last project we used Browser Router which could not as easily be transfered to react-native, but by choosing to use [react-native-modal](https://github.com/react-native-community/react-native-modal) we could use some of the previously made components and implement them in the chosen third party component.

# Functionality

IMDbest is mobile application for finding movies. The app has a large database of movies from many different directors and genres. On IMDbest you can search for movies based on title or director and add them to your watchlist.

## Front end

##### Homepage
The homepage is where the user can brower all of the movies stored in the database. From here it is possible to search based on both movie title and the director's name. Only 10 movies are fetched at the time, until the user presses the 'fetch-more' button at the bottom of the list. It is also possible to choose which filters and which way the movies are sorted from here.
![Homepage](assets/images/Home.PNG)

##### Watchlist
The watchlist contains movies that the user has chosen to save in the AsyncStorage. Adding and removing movies from the watchlist, can be done through the movie's detail page.
![Homepage](assets/images/Watchlist.JPG)

##### Detailed view
When a movie is pressed, the corresponding movie's detail page is opened. When this happens the rest of the needed data is fetched and rendered. From the detail page the user can add or remove the movie som their watchlist, as well as see more detailed information about the movie.
![Homepage](assets/images/Watchlist.JPG)

#### Filter & Sorting 
The filter and sorting are available through the filter modal. The filter modal can be reached from the filterbutton on the homepage. When you press the filterbutton, the filter modal pops up and you can select different sort values and filters. To apply the filters selected you need to press the apply filter button. The sort value are changed instantly when you select a sort value, and you don't need to press the apply filter button. You can also reset the filter using the reset filter button. The filter modal can be closed both with swipe downwards or pressing the x button. 


### React Native

In this project we are using React Native as our frontend framework, in combination with Redux as the state management tool.

### [React Native Elements](https://react-native-elements.github.io/react-native-elements/)

React Native Elements is a third party library which makes it easy to create an app by providing finished components. We chose this third-party component library because it is well documented, cross-platform and easy to set up. By implementing this, we reduced the development time significantly and created a more streamlined design for our app.

### [Redux](https://redux.js.org/)

We chose to use Redux as a state management library since we had already implemented it in [Project 3](https://gitlab.stud.idi.ntnu.no/IT2810-H19/teams/team-16/project3), and quickly saw the benefits of Redux. We store information such as

- Filter data such as sorting values, active genre, preferred rating and year range.
- Watchlist content.
- Skip-value, to allow for dynamic loading of data.

### AsyncStorage

We use the mobile device's AsyncStorage to store a users watchlist. This removes the need for a sign-up system and makes it easy for the user to add movies to their watchlist.

This is an example of the movie object that gets stored.

```json
Movie: {
  _id:"573a13b8f29313caabd4c241",
  title:"Planet Earth",
  poster:
  "https://m.media-amazon.com/images/M/MV5BNmZlYzIzMTItY2EzYS00YTEyLTg0ZjEtMDMzZjM3ODdhN2UzXkEyXkFqcGdeQXVyNjI0MDg2NzE@._V1_SY1000_SX677_AL_.jpg",
  imdb:
    {rating:"9.5"}
}
```

Ideally we would only need to store the movieIDs, but becuse of the backend functionality we made in [Project 3](https://gitlab.stud.idi.ntnu.no/IT2810-H19/teams/team-16/project3) it was needed to store a little bit more data for this project.

## Backend

We use the same backend as in [Project 3](https://gitlab.stud.idi.ntnu.no/IT2810-H19/teams/team-16/project3), which is based on MongoDB, Express and GraphQL. Note that the original dataset we got from [MongoDB](https://docs.atlas.mongodb.com/sample-data/sample-mflix/) contains some duplicate movies.

#### Search

When you type the name of a movie or a director in the search field, the app executes a GraphQL query called filterMovies to fetch the relevant data.

#### Dynamic loading

When a user presses the load more button, a query is sent to the backend to request additional data. This query uses an offset-based pagination to fetch the correct data. The response is appended to the already fetched data and then displayed accordingly. By implementing dynamic loading we reduce the amount of bandwidth needed, and minimize the overall load on the user. In addition to this the request for data executes in a fraction of the time it takes to request all relevant data.

#### Filtering and sorting

The filtering and sorting is done by a GraphQL query, which takes in both search value, genre, year range, and rating range, which are used to filter out the wrong data from the dataset.

The sorting is done by a built-in function from Mongoose, which sorts either alphabetically, by rating or by release date.

## Testing

#### End-to-end testing

The application has manually been end-to-end tested throughout the project. We've made sure that the app runs smoothly on both iOS and Android devices. Under development we've used Samsung Galaxy S8, OnePlus 6, iPhone 6, iPhone SE as well as multiple different emulators to ensure similar experiences and functionality.
