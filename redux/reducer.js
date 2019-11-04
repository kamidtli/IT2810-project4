const initialState = {
  skip: 0,
  yearRange: [1893, 2019],
  ratingRange: [0, 10],
  genre: '',
  sortValue: '-imdb',
  watchlist: [],
};

const reducer = (state = initialState, action) => {
  const newState = {...state};

  switch (action.type) {
    case 'UPDATE_SKIP':
      newState.skip = action.skipValue;
      break;
    case 'ADD_YEAR_FILTER':
      newState.yearRange = action.years;
      break;
    case 'ADD_RATING_FILTER':
      newState.ratingRange = action.ratings;
      break;
    case 'ADD_GENRE_FILTER':
      newState.genre = action.chosenGenre;
      break;
    case 'NEW_SORT_VALUE':
      newState.sortValue = action.sortValue;
      break;
    case 'CREATE_WATCHLIST':
      newState.watchlist = action.movies;
      break;
    case 'ADD_TO_WATCHLIST':
      newState.watchlist.push(action.movie);
      break;
    case 'REMOVE_FROM_WATCHLIST':
      newState.watchlist = newState.watchlist.filter(
          (movie) => movie._id !== action.movieID,
      );
      break;
    default:
      break;
  }
  return newState;
};

export default reducer;
