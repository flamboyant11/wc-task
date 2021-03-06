import axios from "axios";
import { GET_ERRORS, GET_NEWS, SET_ARTICLE, SET_SEARCH, GET_MORE, SEARCH_TERM, GET_PAGE, SET_SORT, SET_LOADING } from './types'

const apiKey = process.env.REACT_APP_API_KEY

export const getNews = (search, sort, page) => async (dispatch, getState) => {
    const params = search ? `everything?q=${search}` : 'top-headlines?country=us'
    const sortBy = sort ? `&sortBy=${sort}` : ''
    const newPage = page > 1 ? `&page=${page}` : ''
    //no need to send page number if we need first page

    const { error } = getState().errorLoader
    error && dispatch(getError(''))
    //if there are previous errors, dispatch no errors

    !newPage && dispatch({ type: SET_LOADING, payload: true })
    //set loading true on every call except Get More

    await axios.get(`https://newsapi.org/v2/${params}${sortBy}${newPage}&apiKey=${apiKey}`)
        .then(res => {
            dispatch({
                type: newPage ? GET_MORE : GET_NEWS,
                payload: res.data
            })
            dispatch({ type: SET_LOADING, payload: false })
            //if newPage, dispatch get_more, else get_news, set loader to false
        })
        .catch(err => dispatch(getError(err.response.data.message)))
    //catch errors
}

export const setArticle = (article, history) => dispatch => {
    dispatch({
        type: SET_ARTICLE,
        payload: article
    })
    history.push('/article')
    //set article, and push to article
}

export const setPage = (page) => dispatch => {
    dispatch({
        type: GET_PAGE,
        payload: page
    })
    //set page
}

export const setSearchTerm = (search, history) => dispatch => {
    dispatch(setPage(1))
    dispatch(setSort(''))
    //reset page and sorting

    dispatch({
        type: SEARCH_TERM,
        payload: search
    })
    //set search term on Search button click so we can decide if we will render clear/dropdown

    history.location.pathname !== '/' && history.push('/')
    // in case user is on /article
}

export const setSort = (sort) => dispatch => {
    dispatch(setPage(1))
    //reset page

    dispatch({
        type: SET_SORT,
        payload: sort
    })
    //change sort value
}

export const onSearchChange = (inputValue) => dispatch => {
    dispatch({
        type: SET_SEARCH,
        payload: inputValue
    })
    //on input change
}

export const clearSearch = (history) => dispatch => {
    dispatch(onSearchChange(''))
    dispatch(setSearchTerm('', history))
    dispatch(setSort(''))
    dispatch(setPage(1))
    // clear search, term, pages, sort
}

const getError = (error) => dispatch => {
    dispatch({
        type: GET_ERRORS,
        payload: error
    })
}