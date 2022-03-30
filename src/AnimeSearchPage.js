import { Layout, } from 'antd';
import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';
import axios from 'axios'
import AnimeList from './components/AnimeList';
import { useNavigate, } from 'react-router-dom';
import { filter, find, union } from 'lodash';

const { Header, Content } = Layout

const AnimeSearchPage = () => {
    const [animeList, setAnimeList] = useState([])
    const [loading, setLoading] = useState(false)
    const [textFilter, setTextFilter] = useState(null)
    const [showStarred, setShowStarred, ] = useState(false)
    const [showHearted, setShowHearted, ] = useState(false)

    const navigate = useNavigate()
    useEffect(() => {
        getAnimeList()
    }, [])

    useEffect(() => {
        filterAnimeList()
    }, [textFilter])

    const getAnimeList = async () => {
        setLoading(true)
        const { data } = await axios.get(
            `https://kitsu.io/api/edge/anime?page[offset]=${animeList.length}${textFilter ? `&filter[text]=${textFilter}` : ''}
            `
        )
        setLoading(false)

        let starredAnimeList = JSON.parse(localStorage.getItem('starredAnimeList')) || []
        let heartedAnimeList = JSON.parse(localStorage.getItem('heartedAnimeList')) || []

        setAnimeList([...animeList, ...data.data].map((anime) => ({
            ...anime,
            starred: find(starredAnimeList, (id) => id === anime.id),
            hearted: find(heartedAnimeList, (id) => id === anime.id)
        })))
    }

    const filterAnimeList = async () => {
        setLoading(true)
        const { data } = await axios.get(`https://kitsu.io/api/edge/anime?${textFilter ? `filter[text]=${textFilter}` : ''}`)
        setLoading(false)

        let starredAnimeList = JSON.parse(localStorage.getItem('starredAnimeList')) || []
        let heartedAnimeList = JSON.parse(localStorage.getItem('heartedAnimeList')) || []

        setAnimeList([...data.data].map((anime) => ({
            ...anime,
            starred: find(starredAnimeList, (id) => id === anime.id),
            hearted: find(heartedAnimeList, (id) => id === anime.id)
        })))
        
    }

    const handleSearch = ({ title }) => {
        setTextFilter(title)
    }

    const handleStarredAnime = (id, starred) => {
        let newAnimeList = animeList.map((anime) => anime.id === id ? { ...anime, starred} : anime)
        setAnimeList(newAnimeList)

        let starredAnimeList = JSON.parse(localStorage.getItem('starredAnimeList')) || []

        if(starred) {
            localStorage.setItem('starredAnimeList', JSON.stringify(union([...starredAnimeList], [id])))
        } else {
            localStorage.setItem('starredAnimeList', JSON.stringify(starredAnimeList.filter(item => item !== id)))
        }
    }

    const handleHeartedAnime = (id, hearted) => {
        let newAnimeList = animeList.map((anime) => anime.id === id ? { ...anime, hearted} : anime)
        setAnimeList(newAnimeList)
        
        let heartedAnimeList = JSON.parse(localStorage.getItem('heartedAnimeList')) || []

        if(hearted) {
            localStorage.setItem('heartedAnimeList', JSON.stringify(union([...heartedAnimeList], [id])))
        } else {
            localStorage.setItem('heartedAnimeList', JSON.stringify(heartedAnimeList.filter(item => item !== id)))
        }
    }

    const handleFilterStarred = () => {
        let newAnimeList = filter(animeList, ({starred}) => starred)
        setShowStarred(!showStarred)
        setAnimeList(newAnimeList)
    }

    const handleFilterHearted = () => {
        let newAnimeList = filter(animeList, ({hearted}) => hearted)
        setShowHearted(!showHearted)
        setAnimeList(newAnimeList)
    }

    return (
        <Layout>
            <Header className="bg-white">
                <h1 className="text-center">Anime List</h1>
            </Header>
            <Content className="flex flex-col p-10">
                <SearchBar
                    resultCount={animeList.length || null}
                    onSearch={handleSearch}
                    onFilterStarred={handleFilterStarred}
                    onFilterHearted={handleFilterHearted}
                    showStarred={showStarred}
                    showHearted={showHearted}
                />
                {
                    <AnimeList
                        animeList={animeList}
                        onLoadMore={getAnimeList}
                        loading={loading}
                        onCardClick={(id) => navigate(`/${id}`)}
                        onStarClick={(id, starred) => {
                            handleStarredAnime(id, starred)
                        }}
                        onHeartClick={(id, hearted) => {
                            handleHeartedAnime(id, hearted)
                        }}
                    />
                }
            </Content>
        </Layout>
    )
}

export default AnimeSearchPage