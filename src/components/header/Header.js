import React from 'react'
import { Input, Navbar, Button, InputGroup } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getNews, onSearchChange } from '../../actions/actions';
import './Header.css';

const Header = () => {
    const search = useSelector(state => state.search.search)
    const dispatch = useDispatch()

    const onChange = (e) => {
        dispatch(onSearchChange(e.target.value))
    }

    const onSearchClick = () => {
        dispatch(getNews(search))
    }

    return (<Navbar expand className='navbar rounded ms-2 me-1'>
        <div className='fs-4 app-title'>News App</div>
        <InputGroup className='w-50'>
            <Input value={search} onChange={onChange} />
            <Button color="primary" onClick={onSearchClick}>Search</Button>
        </InputGroup>
    </Navbar>)
}

export default Header