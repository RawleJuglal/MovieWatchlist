import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from '../Form/Form'
import Splash from '../Splash/Splash';
import Movie from '../Movie/Movie'

function App() {
  const [state,setState] = React.useState({fullInfoArr:[], watchList:[], searched:false})
  const styles = {
    content:{
      height: state.fullInfoArr.length > 0 ? 'unset' : '75vh',
      minHeight: state.fullInfoArr.length > 0 ? '75vh' : 'unset'
    }
  };


  React.useEffect(()=>{
    if(state.searchResults !== undefined){
      filterSearchResults()
    } 
  },[state.searchResults])

  async function callApi(term, page){
    console.log('first api call')
    let res = await fetch(`http://www.omdbapi.com/?s=${term}&page=${page}&apikey=7214b8df`)
    let data = await res.json();
    setState((prevState)=>{
      return {...prevState, searchResults:data}
    })
  }

  function filterSearchResults(){
    console.log('filtering results')
    state.searchResults.Search.map((ele)=>{
      secondAPICall(ele.Title.replaceAll(' ', '+').toLowerCase())
    })
  }

  async function secondAPICall(title){
    console.log('second api call')
    let response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=7214b8df`)
    let data = await response.json();
    let newObj = data;
    let newFullInfoArr = state.fullInfoArr;
    newFullInfoArr.push(newObj)
    setState((prevState)=>{
      return {...prevState, fullInfoArr:newFullInfoArr, searched:!state.searched}
    })
  }

  function searchForTerm(){
    callApi(state.term, 1)
  }

  function handleInputChange(event){
    let newTerm = event.target.value.replaceAll(' ', '+').toLowerCase();
    setState((prevState)=>{
      return {...prevState, term:newTerm}
    })
  }

  function addToWatchlist(id){
    console.log(id);
  }
  
  return (
    <div id='--app-app-container'>
      <header id="--app-header-container">
        <h1 id="--app-page-title">Find your film</h1>
        <Button id="--app-switch-page-link" variant="link">My Watchlist</Button>
        <Form handleChange={handleInputChange} handleSearch={searchForTerm}/>
      </header>
      <div id='--app-content-container' className='content' style={styles.content}>
        {state.fullInfoArr.length > 0 ? <div id='--shelf-shelf-container'><Movie data={state.fullInfoArr} handleAdd={addToWatchlist}/></div> : <Splash searched={state.searched}/>}
        
      </div>
    </div>
  )
}

export default App
