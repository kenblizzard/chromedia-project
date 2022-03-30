import { HeartFilled, HeartOutlined, StarFilled, StarOutlined } from '@ant-design/icons'
import { Form, Input } from 'antd'

const SearchBar = ({
    onSearch,
    onFilterStarred,
    onFilterHearted,
    resultCount,
    showStarred,
    showHearted
}) => {
    return (
        <div className="flex justify-between w-full">
            <div className="space-x-2 w-1/4">
                <span>Filter:</span>
                <span>
                    {
                        showStarred ?
                        <StarFilled onClick={() => onFilterStarred(false)} /> :
                            <StarOutlined onClick={() => onFilterStarred(true)} />
                    }
                </span>
                <span>
                    {
                        showHearted ?
                        <HeartFilled onClick={() => onFilterHearted(false)} /> :
                            <HeartOutlined onClick={() => onFilterHearted(true)} /> 
                    }
                </span>
            </div>
            <Form onFinish={onSearch} className="w-2/4">
                <Form.Item name="title">
                    <Input className="w-full" placeholder="Search Anime" />
                </Form.Item>
            </Form>
            <div className="w-1/4 text-right">{resultCount} results</div>
        </div>
    )
}

export default SearchBar