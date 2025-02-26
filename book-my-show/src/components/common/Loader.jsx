import React from 'react'

const Loader = () => {
    return (
        <>
        <iframe src="https://giphy.com/embed/J3FXULkUyQqNva9Wcw"
            width="500px"
            height="500px"
            style={{position: 'absolute', top: 0, left:0,}}
            frameBorder={0}
            className="giphy-embed"
            allowFullScreen
        ></iframe>
        loading ...</>
    )
}

export default Loader