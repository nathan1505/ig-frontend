import React, {useState, useEffect, useContext} from 'react'
import Post from '../components/Post'

import {UserContext} from '../context/UserContext'
import {LikesContext} from '../context/LikesContext'

export default ({match, history}) => {

    const {id} = match.params
    console.log("id", id)

    const {user, setUser} = useContext(UserContext)
    console.log("user", user)
    console.log("setUser", setUser)

    const {likesGiven, reloader} = useContext(LikesContext)

    const isPostAlreadyLiked =(() => {
        return likesGiven && likesGiven.find(like => like.post && like.post.id == id)
    })()

    console.log("isPostAlreadyLiked", isPostAlreadyLiked)

    const [post, setPost] = useState({})
    const [loading, setLoading] = useState(true)
    const [edit, setEdit] = useState(false)

    //Used for the edit form
    const [description, setDescription] = useState('')

    const fetchPost = async () => {
        const response = await fetch(`http://localhost:1337/posts/${id}`)
        const data = await response.json()

        console.log("data", data)
        setPost(data)
        setDescription(data.description)
        setLoading(false)
    }

    const handleDelete = async () => {
        const response = await fetch(`http://localhost:1337/posts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.jwt}`
            }
        })
        const data = await response.json()
        history.push('/')
    }

    const handleEditSubmit = async (event) => {
        event.preventDefault()
        console.log("handleEditSubmit")

        const response = await fetch(`http://localhost:1337/posts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.jwt}`
            },
            body: JSON.stringify({
                description
            })
        })

        const data = await response.json()
        fetchPost()
        console.log("handleEditSubmit data", data)
    }

    const handleLike = async () => {
        try{
            const response = await fetch('http://localhost:1337/likes', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post: parseInt(id)
                })
            })
            fetchPost()
            reloader()
        } catch(err){
            console.log("Exception ", err)
        }
    }

    const handleRemoveLike = async () => {
        try{
            const response = await fetch(`http://localhost:1337/likes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.jwt}`,
                }
            })
            fetchPost()
            reloader()
        } catch(err){
            console.log("Exception ", err)
        }
    }

    useEffect(() => {
        fetchPost()
    }, [])

    return (
        <div>
            {loading &&
                <p>Loading...</p>
            }
            {!loading &&
                <>
                    {post.id &&
                        <>
                            <Post
                            description={post.description}
                            url={post.image && post.image.url}
                            likes={post.likes}
                            />

                            {user &&
                                <>
                                    {isPostAlreadyLiked &&
                                        <button onClick={handleRemoveLike}>Remove Like</button>
                                    }
                                    {!isPostAlreadyLiked &&
                                        <button onClick={handleLike}>Like</button>
                                    }
                                </>
                            }

                            {user &&
                                <>
                                    <button onClick={handleDelete}>Delete this Post</button>
                                    <button onClick={() => setEdit(true)}>Edit this Post</button>
                                    {edit &&
                                        <form onSubmit={handleEditSubmit}>
                                            <input
                                                value={description}
                                                onChange={(event) => setDescription(event.target.value)}
                                                placeholder="New description"
                                            />
                                            <button>Confirm</button>
                                        </form>
                                    }
                                </>
                            }
                        </>
                    }
                    {!post.id &&
                        <p>404 - not found</p>
                    }
                </>
            }
        </div>
    )
}