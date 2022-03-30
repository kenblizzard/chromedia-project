import { Card } from "antd"
import axios from "axios"
import { get } from "lodash"
import { useEffect, useState } from "react"

const Character = ({ id }) => {
    const [characterDetails, setCharacterDetails] = useState(null)
    useEffect(() => {
        axios.get(`https://kitsu.io/api/edge/anime-characters/${id}/character`)
            .then(({ data }) => {
                setCharacterDetails(data.data.attributes)
            })
    }, [])

    return (
        <Card
            className="m-3 text-center"
            cover={<img alt="example" className="object-cover" height="200" src={get(characterDetails, 'image.original', get(characterDetails, 'image.medium'))} />}
        >
            <Card.Meta
                title={get(characterDetails, 'canonicalName')}
            />
        </Card>
    )
}

export default Character