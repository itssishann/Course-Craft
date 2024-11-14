import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        headers: headers,
        method: method,
        url: url,
        data: bodyData ? bodyData : null, 
        params: params ? params : null
    });
}
