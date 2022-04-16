// utils
import axios from '../utils/axios';

const getAnswersheets = async (params = {}) => {
    const { data } = await axios({
        url: '/v1/answersheets',
        params
    })
    return data;
}

export {
    getAnswersheets,
}