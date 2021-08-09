import React from 'react'

const post = {
    "id": 1,
    "description": "Me playing squash a few years ago",
    "likes": 20,
    "author": null,
    "published_at": "2021-07-12T01:30:24.483Z",
    "created_at": "2021-07-12T01:27:08.537Z",
    "updated_at": "2021-07-12T01:30:24.497Z",
    "image": {
        "url": "/uploads/images_3105f2c260.jpeg",
    }
}

const API_URL = 'http://localhost:1337'

const formatImageUrl = (url) => `${API_URL}${url}`

export default ({description, likes, url}) => {


    return (
        <div className="Post">
            <img className="Post__Image" src={formatImageUrl(url)} />
            <h4>{description}</h4>
            <div>
                <span>Likes: {likes}</span>
            </div>
        </div>
    )
}
