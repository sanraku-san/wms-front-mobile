import {URL} from "./configuration";

export const getStores = async (token) =>{
    const res = await fetch(`${URL}/stores`,{
        method:'GET',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
    });
    return res.json();
}

export const createStore = async (token, data)=>{
    const res = await fetch(`${URL}/stores`,{
        method:'POST',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body:JSON.stringify(data),
    });
    return res.json();
}

export const updateStore = async (id, store, token) => {
    const res = await fetch(`${URL}/stores/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(store),
    });
    return res.json();
  };

  export const getStoresById = async (id, token) => {
    const res = await fetch(`${URL}/stores/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  };

export const deleteStore = async (id, token) =>{
    const res = await fetch(`${URL}/stores/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();  
  
  }