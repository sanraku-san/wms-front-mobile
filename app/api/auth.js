import {URL} from "./configuration"

export const loginUser = async (email , password) => {
    const res = await fetch(`${URL}/login`,{
        method:'POST',
        headers:{
            Accept:'application/json',
            "Content-Type":"application/json",
        },
        body:JSON.stringify(email,password)
        
    })
    return await res.json();
}

export const register = async (inputs) =>{
    const res = await fetch(`${URL}/register`,{
        method:'POST',
        headers:{
            Accept:'application/json',
            "Content-Type":"application/json",
        },
        body:JSON.stringify(inputs)
    })
    return await res.json();
}


export const checkToken = async (token) => {
    const res = await fetch(`${URL}/users`, {
        method: "GET",
        headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`
        },
        body:JSON.stringify(inputs)
    })
    return await res.json()
}

export const logout = async (token) =>{
    const res = await fetch(`${URL}/logout`,{
        method:'POST',
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        },
    })
    return await res.json();
}