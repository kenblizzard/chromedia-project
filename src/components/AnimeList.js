import { Card, List, Spin } from "antd"
import { get } from 'lodash'
import { HeartFilled, HeartOutlined, StarFilled, StarOutlined } from '@ant-design/icons'
import InfiniteScroll from "react-infinite-scroll-component"

const AnimeList = ({
    animeList,
    loading,
    onLoadMore,
    onCardClick,
    onStarClick,
    onHeartClick
}) => {
    return (

        <InfiniteScroll
            dataLength={animeList.length}
            next={onLoadMore}
            hasMore={true}
            loader={loading ? <div className="text-center" ><Spin size="large" /></div> : null}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>
            }

        >
            <List
                dataSource={animeList}
                className="overflow-hidden"
                grid={{ column: 1, xs: 1, md: 2, lg: 3, xl: 4, xxl: 4, gutter: 16 }}
                renderItem={({ id, attributes, starred, hearted }) => (
                    <Card
                        hoverable
                        className="m-3"
                        cover={<img alt="example" className="object-cover" height="200" src={get(attributes, 'coverImage.original', get(attributes, 'posterImage.original'))} />}
                        onClick={() => onCardClick(id)}
                    >
                        <Card.Meta
                            title={get(attributes, 'canonicalTitle', get(attributes, 'titles.en_jp'))}
                            description={
                                <div className="flex justify-between">
                                    <span>
                                        {
                                            starred ?
                                                <StarFilled onClick={(e) => {
                                                    e.stopPropagation()
                                                    onStarClick(id, false)
                                                }}
                                                    style={{ fontSize: '20px' }}
                                                /> :
                                                <StarOutlined onClick={(e) => {
                                                    e.stopPropagation()
                                                    onStarClick(id, true)
                                                }}
                                                    style={{ fontSize: '20px' }}
                                                />
                                        }
                                        &nbsp;{attributes.averageRating}
                                    </span>
                                    <span>
                                        {
                                            hearted ?
                                                <HeartFilled
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onHeartClick(id, false)
                                                    }}
                                                    style={{ fontSize: '20px' }}
                                                /> :
                                                <HeartOutlined
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onHeartClick(id, true)
                                                    }}
                                                    style={{ fontSize: '20px' }}
                                                />
                                        }
                                        &nbsp;{attributes.favoritesCount}
                                    </span>
                                </div>
                            }
                        />
                    </Card>
                )}
            />

        </InfiniteScroll>
    )
}

export default AnimeList