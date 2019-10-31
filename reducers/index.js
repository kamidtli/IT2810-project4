const initialState = {
  pages: [0],
  lastPage: false,
  search: [],
  currentCard: '',
  yearRange: [1893, 2019],
  ratingRange: [0, 10],
  genre: '',
  sortValue: '',
  watchlist: []
};

const reducer = (state = initialState, action) => {
  const newState = { ...state };

  switch (action.type) {
    case 'NEW_PAGE':
      newState.pages.push(action.page);
      break;
    case 'LAST_PAGE':
      newState.lastPage = action.val;
      break;
    case 'NEW_SEARCH':
      newState.search.push(action.searchString);
      break;
    case 'RESET_SEARCH':
      newState.pages = [0];
      newState.lastPage = false;
      newState.yearRange = [1893, 2019];
      newState.ratingRange = [0, 10];
      newState.genre = '';
      newState.sortValue = '';
      break;
    case 'RESET_PAGES':
      newState.pages = [0];
      newState.lastPage = false;
      break;
    case 'CURRENT_CARD':
      newState.currentCard = action.id;
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
      newState.watchlist.push(action.movieID);
      break;
    case 'REMOVE_FROM_WATCHLIST':
      newState.watchlist = newState.watchlist.filter(
        movie => movie !== action.movieID
      );
      break;
    case 'CLEAR_WATCHLIST':
      newState.watchlist = null;
      break;
    default:
      break;
  }
  return newState;
};

export default reducer;
