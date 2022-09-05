// utils
import axios from '../utils/axios';

const getVideo = async (id) => {
    const { data } = await axios.get(`/v1/videos/${id}`);
    return data;
}

export { getVideo }