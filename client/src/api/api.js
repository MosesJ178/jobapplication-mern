import axios from "axios";

const api = axios.create({
    baseURL:'https://jobapplication-app.onrender.com/',
    withCredentials:true
})

export default api;