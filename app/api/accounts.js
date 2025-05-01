import {URL} from './configuration';

export const getUser = async () =>{
    const res = await fetch(`${URL}/users`,{
        method:'GET',
        headers:{
            "Content-Type":"application/json",
        },
    });
    return res.json();
}

export const getUserById = async (id) => {
    const res = await fetch(`${URL}/users/${id}`);
    return res.json();
  };

export const createUser = async (data)=>{
    const res = await fetch(`${URL}/users`,{
        method:'POST',
        headers:{   
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
    });
    return res.json();
}
export const deleteUser = async (id) =>{
    const res = await fetch(`${URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return res.json();  
  
  }