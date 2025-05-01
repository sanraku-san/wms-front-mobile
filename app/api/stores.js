import {URL} from "./configuration";

export const getStores = async () =>{
    const res = await fetch(`${URL}/stores`,{
        method:'GET',
        headers:{
            "Content-Type":"application/json",
        },
    });
    return res.json();
}

export const createStore = async (data)=>{
    const res = await fetch(`${URL}/stores`,{
        method:'POST',
        headers:{   
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
    });
    return res.json();
}
export const updateStore = async (id, store) => {
    const res = await fetch(`${URL}/stores/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(store),
    });
    return res.json();
  };
  export const getStoresById = async (id) => {
    const res = await fetch(`${URL}/stores/${id}`);
    return res.json();
  };

export const deleteStore = async (id) =>{
    const res = await fetch(`${URL}/stores/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return res.json();  
  
  }