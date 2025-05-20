import {URL} from './configuration';

export const getUser = async (token) =>{
    const res = await fetch(`${URL}/users`,{
        method:'GET',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    });
    return res.json();
}
export const getProfile = async (token) =>{
    const res = await fetch(`${URL}/profile`,{
        method:'GET',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    });
    return res.json();
}

export const getUserById = async (id, token) => {
    const res = await fetch(`${URL}/users/${id}`,{
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  };

export const createUser = async (token, data)=>{
    const res = await fetch(`${URL}/users`,{
        method:'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify(data, token),
    });
    return res.json();
}
export const deleteUser = async (id, token) =>{
    const res = await fetch(`${URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();  
  
  }