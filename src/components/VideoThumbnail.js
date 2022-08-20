import { useState, useEffect } from 'react';
import axios from "axios";

import Image from "./Image";

export default function VideoThumbnail({ url, ...props }) {
    const [thumbnail, setThumbnail] = useState('');
    useEffect(() => {
        axios.get(`https://noembed.com/embed?url=${url}`).then(({ data }) => {
            setThumbnail(data.thumbnail_url);
        })
    }, [url]);

    return <Image src={thumbnail} ratio="16/9" {...props} />

}