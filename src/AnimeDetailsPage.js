import { CheckSquareOutlined, CheckSquareTwoTone, HeartFilled, HeartOutlined, StarFilled, StarOutlined } from "@ant-design/icons"
import { Layout, List, Spin } from "antd"
import axios from "axios"
import { get, find, union } from "lodash"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Character from "./components/Character"

const { Header, Content } = Layout

const AnimeDetailsPage = () => {
    const [animeDetails, setAnimeDetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const [episodes, setEpisodes] = useState(null)
    const [characters, setCharacters] = useState(null)
    const { animeId } = useParams()
    const navigate = useNavigate()

    const getAnimeDetails = async () => {
        setLoading(true)
        const { data } = await axios.get('https://kitsu.io/api/edge/anime/' + animeId)

        let starredAnimeList = JSON.parse(localStorage.getItem('starredAnimeList')) || []
        let heartedAnimeList = JSON.parse(localStorage.getItem('heartedAnimeList')) || []

        setAnimeDetails({
            ...data.data,
            starred: find(starredAnimeList, (id) => id === data.data.id),
            hearted: find(heartedAnimeList, (id) => id === data.data.id)
        })
        setLoading(false)
    }
    useEffect(() => {
        getAnimeDetails()
    }, [])

    useEffect(() => {
        if (animeDetails) {
            axios.get(animeDetails.relationships.episodes.links.related)
                .then(({ data }) => {

                    let watchedEpisodes = JSON.parse(localStorage.getItem('watchedEpisodes')) || []
                    setEpisodes([...data.data].map((episode) => ({
                        ...episode,
                        watched: find(watchedEpisodes, (id) => id === episode.id),
                    })))
                })

            axios.get(animeDetails.relationships.animeCharacters.links.related)
                .then(({ data }) => {
                    setCharacters(data.data)
                })
        }
    }, [animeDetails])

    const handleStarredAnime = (id, starred) => {
        let starredAnimeList = JSON.parse(localStorage.getItem('starredAnimeList')) || []

        if (starred) {
            localStorage.setItem('starredAnimeList', JSON.stringify(union([...starredAnimeList], [id])))
        } else {
            localStorage.setItem('starredAnimeList', JSON.stringify(starredAnimeList.filter(item => item !== id)))
        }

        setAnimeDetails({ ...animeDetails, starred })
    }

    const handleHeartedAnime = (id, hearted) => {
        let heartedAnimeList = JSON.parse(localStorage.getItem('heartedAnimeList')) || []

        if (hearted) {
            localStorage.setItem('heartedAnimeList', JSON.stringify(union([...heartedAnimeList], [id])))
        } else {
            localStorage.setItem('heartedAnimeList', JSON.stringify(heartedAnimeList.filter(item => item !== id)))
        }

        setAnimeDetails({ ...animeDetails, hearted })
    }

    const handleWatched = (id, watched) => {
        let watchedEpisodes = JSON.parse(localStorage.getItem('watchedEpisodes')) || []

        if (watched) {
            localStorage.setItem('watchedEpisodes', JSON.stringify(union([...watchedEpisodes], [id])))
        } else {
            localStorage.setItem('watchedEpisodes', JSON.stringify(watchedEpisodes.filter(item => item !== id)))
        }

        setEpisodes(episodes.map((episode) => ({
            ...episode,
            watched: id === episode.id ? watched : episode.watched,
        })))
    }

    return (
        <>
            {
                loading ?
                    <div className="flex h-screen justify-center items-center"><Spin size="large" /> </div> :
                    <Layout>
                        <Header className="bg-white">
                            <h1 className="text-center">{get(animeDetails, 'attributes.canonicalTitle', get(animeDetails, 'attributes.titles.en_jp'))}</h1>
                        </Header>
                        <Content className="flex flex-col p-10">
                            <a href="#" onClick={() => navigate(-1)}> &lt; Back</a>
                            <div className="flex flex-col md:flex-row my-4">
                                <div className="w-full md:w-1/4 flex flex-col space-y-3">
                                    <img alt="example" className="object-cover" height="400" src={get(animeDetails, 'attributes.coverImage.original', get(animeDetails, 'attributes.posterImage.original'))} />
                                    <span>
                                        {get(animeDetails, 'starred') ?
                                            <StarFilled style={{ fontSize: '20px' }} onClick={() => handleStarredAnime(animeDetails.id, false)} /> :
                                            <StarOutlined style={{ fontSize: '20px' }} onClick={() => handleStarredAnime(animeDetails.id, true)} />}
                                        &nbsp;{get(animeDetails, 'attributes.averageRating')} from {get(animeDetails, 'attributes.userCount')} users
                                    </span>
                                    <div className="flex flex-row">
                                        <div className="mr-4">
                                            {get(animeDetails, 'hearted') ?
                                                <HeartFilled style={{ fontSize: '20px' }} onClick={() => handleHeartedAnime(animeDetails.id, false)} /> :
                                                <HeartOutlined style={{ fontSize: '20px' }} onClick={() => handleHeartedAnime(animeDetails.id, true)} />}
                                            &nbsp;{get(animeDetails, 'attributes.favoritesCount')}
                                        </div>
                                        <div>Rank #{get(animeDetails, 'attributes.ratingRank')}</div>
                                    </div>
                                    <div className="flex flex-row">
                                        Rated {get(animeDetails, 'attributes.ageRating')}: {get(animeDetails, 'attributes.ageRatingGuide')}
                                    </div>
                                    <div className="flex flex-row">
                                        Aired on {get(animeDetails, 'attributes.startDate')}
                                    </div>
                                    <div className="flex flex-row">
                                        {get(animeDetails, 'attributes.endDate') ? `Ended On ${get(animeDetails, 'attributes.endDate')}` : `Ongoing`}
                                    </div>
                                    <div className="flex flex-row">
                                        Type: {get(animeDetails, 'attributes.showType')}
                                    </div>
                                </div>
                                <div className="w-full md:3/4 flex flex-col">
                                    <div className="px-0 py-10 md:px-10 md:py-0">
                                        {get(animeDetails, 'attributes.synopsis')}
                                    </div>
                                    <div className="px-0 py-10 md:px-10 md:py-0 flex flex-col my-5">
                                        <strong>Characters</strong>
                                        <div className="flex flex-row">
                                            {
                                                characters &&
                                                <List
                                                    grid={{
                                                        xs: 2,
                                                        md: 3,
                                                        lg: 4
                                                    }}
                                                    dataSource={characters}
                                                    renderItem={
                                                        ({ id }) =>
                                                            <Character id={id} />
                                                    } />
                                            }

                                        </div>
                                    </div>
                                    <div className="px-0 py-10 md:px-10 md:py-0 flex flex-col my-5">
                                        <strong>Episodes</strong>
                                        {
                                            episodes && episodes.map(({ attributes, id, watched }) => (
                                                attributes.canonicalTitle ?
                                                    <div className="my-1">
                                                        {watched ?
                                                            <CheckSquareTwoTone
                                                                onClick={() => handleWatched(id, false)}
                                                                style={{ fontSize: '20px' }}
                                                            /> :
                                                            <CheckSquareOutlined
                                                                onClick={() => handleWatched(id, true)}
                                                                style={{ fontSize: '20px' }}
                                                            />
                                                        } &nbsp; {attributes.airdate} {attributes.canonicalTitle}
                                                    </div> :
                                                    null
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </Content>
                    </Layout>
            }
        </>

    )
}

export default AnimeDetailsPage