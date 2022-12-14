import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from '../Form/Form'
import Splash from '../Splash/Splash';
import Movie from '../Movie/Movie'
import { UilAngleRightB } from '@iconscout/react-unicons'

function App() {
  const [state,setState] = React.useState({fullInfoArr:[], watchList:[], pagination:{currentPage:1, pages:null}, modal:{visible:false, message:''}, lastSearched:null, searched:false, myList:false})
  const styles = {
    content:{
      height: state.fullInfoArr.length > 0 ? 'unset' : '75vh',
      minHeight: state.fullInfoArr.length > 0 ? '75vh' : 'unset'
    },
    watchList:{
      textDecoration: state.myList ? 'underline' : 'none'
    },
    modalHeader:{
        backgroundColor:state.modal.message === 'added' ? 'rgba(77, 255, 0, .5)' :  state.modal.message === 'removed' ? 'rgba(77, 255, 0, .5)' : 'rgba(211, 205, 4, .5)'
    }
    
  };


  React.useEffect(()=>{
    // console.log('calling useEffect')
    if(state.searchResults !== undefined){
      filterSearchResults()
    } 
  },[state.searchResults])

  function searchForTerm(action){
    // console.log(`calling searchForTerm`)
    startingNewSearch()
    // console.log(action)
    if(action.target.name == 'next'){
      let nextPage = handleNext()
      callApi(state.term, nextPage)
    } else if(action.target.name == 'prev'){
      let prevPage = handlePrev()
      callApi(state.term, prevPage)
    } else if (state.lastSearched !== state.term){
      resetPaginationInfo()
      callApi(state.term, state.pagination.currentPage)
    } else {
      changeModalMessage('Already Searched')
      resetModal()
    }
    // if(action.target.name == 'next'){
    //   console.log('next was clicked')
    //   if(state.pagination.currentPage + 1 < state.pagination.pages){
    //     console.log('next page should be available')
    //     callApi(state.term, nextPage)
    //   } else {
    //     console.log('Error we should not have this button enabled');
    //   }
    // } else if(state.lastSearched !== state.term){
    //   console.log('lastSearch was not the same as term to search now')
    //   callApi(state.term, state.pagination.currentPage)
    // } else {
    //   console.log('we just searched this term')
    //   changeModalMessage('Already Searched')
    //   resetModal()
    // } 
  }

  function handleNext(){
    return state.pagination.currentPage +1
  }

  function handlePrev(){
    return state.pagination.currentPage -1;
  }
    
  function startingNewSearch(){
    setState((prevState)=>{
      return {...prevState, searched:false}
    })
  }

  async function callApi(term, page){
    // console.log('first api call')
    setLatestTerm(term)
    clearInfoArr()
    let res = await fetch(`http://www.omdbapi.com/?s=${term}&page=${page}&apikey=7214b8df`)
    let data = await res.json();
    // console.log(data)
    setPaginationInfo(data.totalResults, page)
    setState((prevState)=>{
      return {...prevState, searchResults:data}
    }) 
  }

  function setLatestTerm(last){
    setState((prevState)=>{
      return {...prevState, lastSearched:last}
    })
  }

  function clearInfoArr(){
    let emptyInfoArr = []
    setState((prevState)=>{
      return {...prevState, fullInfoArr:emptyInfoArr}
    })
  }

  function setPaginationInfo(entries, cPage){
    let newPagination = determinePagination(entries)
    if(state.pagination.pages === null){
      // console.log('this is our first time setting pages')
      newPagination.currentPage = 1;
      // console.log(newPagination)
      setState((prevState)=>{
        return {...prevState, pagination:newPagination}
      })
    } else {
      // console.log('we have pages set')
      newPagination.currentPage = cPage;
      setState((prevState)=>{
        return {...prevState, pagination:newPagination}
      })
    }
  }

  function resetPaginationInfo(){
    let resetPagination = {currentPage:1, pages:null}
    setState((prevState)=>{
      return {...prevState, pagination:resetPagination }
    })
  }

  function determinePagination(total){
     let fullPages = Math.round(total/10)
     let remainder = total%10;
     let newPages = remainder > 0 ? fullPages +1 : fullPages;
    return {pages:newPages}
  }

  function filterSearchResults(){
    // console.log('filtering results')
    // console.log(state)
    state.searchResults.Search.map((ele)=>{
      // console.log(ele.Title.replaceAll(' ', '+').toLowerCase())
      secondAPICall(ele.Title.replaceAll(' ', '+').toLowerCase())
    })
    completedInfoSearch()
  }

  async function secondAPICall(title){
    // console.log('second api call')
    // console.log(state)
    let response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=7214b8df`)
    let data = await response.json();
    // console.log(data)
    let newObj = data;
    let newFullInfoArr;
      // console.log(state.fullInfoArr)
      newFullInfoArr = state.fullInfoArr;
      newFullInfoArr.push(newObj)
      // console.log(newFullInfoArr)
      setState((prevState)=>{
        return {...prevState, fullInfoArr:newFullInfoArr}
      })
      searchForDuplicates()
  }

  function searchForDuplicates(entry){
    let noDuplicates = [...new Map(state.fullInfoArr.map((m)=>[m.imdbID, m])).values()]
    setState((prevState)=>{
      return {...prevState, fullInfoArr:noDuplicates}
    })
  }

  function completedInfoSearch(){
    setState((prevState)=>{
      return {...prevState, searched:true}
    })
    console.log(state)
  }

  

  function handleInputChange(event){
    // console.log(`calling handleInputChange`)
    let newTerm = event.target.value.replaceAll(' ', '+').toLowerCase();
    setState((prevState)=>{
      return {...prevState, term:newTerm}
    })
  }

  function addToWatchlist(id){
    // console.log(`calling addToWatchList`)
    let isFound = state.watchList.some((ele)=>{
      // console.log(ele)
      if(ele.imdbID === id){
        return true;
      } else {
        return false;
      }
    })

    // console.log(isFound)

    if(!isFound){
      let fullInfoCopy = [...state.fullInfoArr]
      let newObj = fullInfoCopy.filter((ele)=>{
        if(ele.imdbID === id){
          return ele;
        }
      })
      let prevWatchList = [...state.watchList];
      let newWatchList = [...prevWatchList, ...newObj]
      changeModalMessage('added')
      resetModal()
      setState((prevState)=>{
        return {...prevState, watchList:newWatchList}
      })
    } else {
      changeModalMessage('Already in watchList')
      resetModal()
    }
  }

  function removeFromWatchlist(id){
    // console.log(`calling removeFromWatchlist`)
    // console.log(state)
    let oldWatchList = state.watchList;
    let newWatchList = oldWatchList.filter((ele)=>{
      return ele.imdbID !== id;
    })
    changeModalMessage('removed')
    resetModal()
    setState((prevState)=>{
      return {...prevState, watchList:newWatchList}
    })
  }

  function changeToWatchList(value){
    // console.log(`calling changeToWatchList`)
    if(value == 'film' && state.myList){
      // console.log('was on watchlist')
      setState((prevState)=>{
        return {...prevState, myList:!state.myList}
      })
    } else if(value == 'watchList' && !state.myList){
      // console.log('was on film')
      setState((prevState)=>{
        return {...prevState, myList:!state.myList}
      })
    } else {
      console.log('args dont meet a change')
      return;
    }   
  }

  function changeModalMessage(newMessage){
    let newModal = {visible:true, message:newMessage}
    setState((prevState)=>{
      return {...prevState, modal:newModal}
    })
  }

  function resetModal(){
    setTimeout(()=>{
      let resetModal = {visible:false, message:''}
      setState((prevState)=>{
        return {...prevState, modal:resetModal}
      })
    },1000)
  }
  
  return (
    <div id='--app-app-container'>
      {state.modal.visible && <div className='--app-modal-message'>
        <Modal show={state.modal.visible} >
          <Modal.Header className='modal-header' style={styles.modalHeader}>
            <Modal.Title>{state.modal.message}</Modal.Title>
          </Modal.Header>
        </Modal>
      </div>}
      <header id="--app-header-container">
        <Button name="film" onClick={(event)=>changeToWatchList(event.target.name)} id="--app-page-title" variant="link">Find your film</Button>
        <Button name="watchList" id="--app-switch-page-link" className='watchList' style={styles.watchList} variant="link" onClick={(event)=>changeToWatchList(event.target.name)}>My Watchlist</Button>
        <Form watch={state.myList} handleChange={handleInputChange} handleSearch={searchForTerm}/>
      </header>
      <div id='--app-content-container' className='content' style={styles.content}>
        {state.myList ? <div id='--shelf-shelf-container'><Movie watch={state.myList} data={state.watchList} handleAdd={addToWatchlist} handleRemove={removeFromWatchlist}/></div> : !state.myList && state.fullInfoArr.length > 0 ? <div id='--shelf-shelf-container'><Movie watch={state.myList} data={state.fullInfoArr} handleAdd={addToWatchlist} handleRemove={removeFromWatchlist}/></div> : <Splash searched={state.searched}/>}
        {state.searchResults.totalResults > 10 && <div className="pagination" id="--app-pagination-container">
          {state.fullInfoArr.length > 0 
            && state.searchResults.totalResults > 10
              && <Button disabled={state.pagination.currentPage === 1} name="prev" onClick={(event)=>searchForTerm(event)} id="--app-prev-page" className='prev-page' variant="secondary">
                    {/* <UilAngleRightB size="15" color="#111827" /> */}Prev
                  </Button>}
          {state.fullInfoArr.length > 0 
            && state.searchResults.totalResults > 10
              && <Button disabled={state.pagination.currentPage === state.pagination.pages} name="next" onClick={(event)=>searchForTerm(event)} id="--app-next-page" className='next-page' variant="secondary">
                    {/* <UilAngleRightB size="15" color="#111827" /> */}Next
                  </Button>}
        </div>}
       

      </div>
    </div>
  )
}

export default App
