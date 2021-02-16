import logo from './logo.svg';
import './App.css';
import React from 'react';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState);

  React.useEffect( () => {
    localStorage.setItem(key, value);
  }, [value, key]);
  
  return [value, setValue]
}
const initialStories = [
  {
    title : 'React',
    url : 'https://reactjs.org/',
    author : 'Jordan Walke',
    num_comments : 3,
    points : 4,
    objectID : 0,
  },
  {
    title : 'Redux',
    url : 'https://redux.js.org/',
    author : 'Dan Abramov, Andrew Clark',
    num_comments : 2,
    points : 5,
    objectID : 1,
  }
];

const getAsyncStories = () =>
  new Promise(resolve => { 
    setTimeout( 
      () => resolve({data: {stories : initialStories }}), 
      2000
    )
  });


const App = () => {
 
  const [searchTerm, setSearchTerm] = useSemiPersistentState( 'search', 'React')
 
  const [stories, setStories] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);

  const [isError, setIsError] = React.useState(false);


  React.useEffect( () => {
    setIsLoading(true);

    getAsyncStories().then(result => {
      setStories(result.data.stories);
      setIsLoading(false);
    }).catch(() => {
      setIsError(true);
    });
  }, []);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  const searchedStories = stories.filter( story => story.title.toLowerCase().includes(searchTerm.toLowerCase()) );


  const handleRemoveStories = item => {
    const newStories = stories.filter(
      story => item.objectID !== story.objectID
    );
      
    setStories(newStories);
  }

  return (
  <div>
    <h1>My Hacker Stories</h1>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused 
      onInputChange={handleSearch}
    >
      <strong>Search: </strong>
    </InputWithLabel>
    <hr />

    {isError && <p>Something went wrong .../</p>}

    { isLoading ? (
        <p>Loading ...</p>
    ) : (
      <List list={searchedStories} onRemoveItem={handleRemoveStories}/> 
    )}
  </div>
  )

}
const List = ({list, onRemoveItem}) => 
  list.map( ( item ) => (<Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}></Item> ));

const Item = ({item, onRemoveItem})=> {
  return (
  <div> 
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </div>
)}

const InputWithLabel = ({id, value, onInputChange, type='text', children, isFocused}) => {

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input id={id}type={type} value={value} ref={inputRef} onChange={onInputChange}/>
    </>
  );
}
const Search = ({search, onSearch}) => 
  (
    <>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" value={search} onChange={onSearch}/>
    </>
  );


export default App;
