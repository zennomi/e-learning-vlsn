// utils
import axios from '../utils/axios';

const getDeposit = async (id) => {
    const { data } = await axios.get(`/v1/deposits/${id}`);
    return data;
}

const getDeposts = async (params) => {
    const { data } = await axios.get(`/v1/deposits`, { params });
    return data;
}

const createDeposit = async (body) => {
    const { data } = await axios.post(`/v1/deposits`, body);
    return data;
}

const verifyDeposit = async (id) => {
    const { data } = await axios.get(`/v1/deposits/${id}/verify`);
    return data;
}

export { getDeposit, createDeposit, getDeposts, verifyDeposit }