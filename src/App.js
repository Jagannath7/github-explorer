import React from 'react';
import Search from './components/Search.js';
import UserCard from './components/UserCard.js';
import RepoCard from './components/RepoCard.js';

const PAGE_SIZE = 10

class App extends React.Component {
  
  state = {
    user : null,
    repos : [],
    userDataError : null,
    loading : false,
    pageSize:10,
    page:1,
    fetchingRepos : false
  }

  componentDidMount(){
    window.addEventListener('scroll',this.handleScroll)
  }

  componentWillUnmount(){
    window.removeEventListener('scroll',this.handleScroll)
  }

  handleScroll = () => {
    const currentScroll = window.scrollY
    const maxScroll = window.scrollmaxY

    const {page,pageSize,user} = this.state


    if( user && maxScroll - currentScroll<=100 &&
      (page-1) * pageSize < user.public_repos
      
      ) this.loadPage()
  }

  fetchUserData = async username => {
    const res =  await fetch(`https://api.github.com/users/${username}`)
    if(res.ok){
      const data = await res.json()
      return {data}
    }
    const error = (await res.json()).message
    return {error}
  }
  
  fetchRepos = async username => {
    const {pageSize,page} = this.state
    const res =  await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${pageSize}`)
    if(res.ok){
      const data = await res.json()
      return {data}
    }
    const error = (await res.json()).message
    return {error}
  }

 
  fetchData =  async username => {
    this.setState({loading : true}, async () => {
      try{
        const [user,repos] =  await Promise.all([
          this.fetchUserData(username),
          this.fetchRepos(username)
        ])
        if(user.data !== undefined && repos.data !== undefined){
          return this.setState({
            user:user.data,
            repos:repos.data ,
            page:2,
            loading:false,
          })
        }
        this.setState({
          userDataError: user.error,
          reposError : repos.error,
          loading : false,  
        })
      }catch(err){
        this.setState({
          error : 'There was some error',
          loading : false
        })
      }
    })
  }
  
  loadPage = async () => {
    if(this.state.fetchingRepos===true) return;
    this.setState({fetchingRepos:true},async ()=>{
    const {data} = await this.fetchRepos(this.state.user.login)
    if(data) this.setState(state => ({
      repos : [...state.repos, ...data],
      page: state.page+1,
      fetchingRepos:false
    }))
  })
  }

 

  render(){
    const {userDataError,reposError, loading, user,repos} = this.state;
    const renderRepos = !loading && !reposError && !!repos.length

    return (
      <div>
      <Search fetchData = {this.fetchData}/>
      <div className='container'>
      <div className ='text-center pt-5'>
      {loading && <p>loading...</p>}
      {userDataError && <p className = 'text-danger'>{userDataError}</p>}
      </div>
      {!loading && !userDataError && user && <UserCard user = {user}/>}
      
      {reposError && <p className = 'text-danger'>{reposError}</p>}

      {renderRepos && (
        <React.Fragment>
        
      {repos.map(repo => (<RepoCard key = {repo.id} repo ={repo}/>))}
      </React.Fragment>
      )}
        </div>
      </div>
    )
  }
}

export default App;
