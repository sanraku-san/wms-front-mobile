import {URL} from "./configuration";

export const getTransactions = async () =>{
    const res = await fetch(`${URL}/transactions`,{
        method:'GET',
        headers:{
            "Content-Type":"application/json",
        },
    });
    return res.json();
}

export const deleteTransaction = async (id) =>{
    const res = await fetch(`${URL}/transactions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return res.json();  
  
  }