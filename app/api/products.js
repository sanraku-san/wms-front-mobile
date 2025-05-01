//this is for the fetching for the products
import { URL } from "./configuration";

export const getProducts = async () =>{
    const res = await fetch(`${URL}/products`,{
        method:'GET',
        headers:{
            "Content-Type":"application/json",
        },
    });
    return res.json();
}

export const createProduct = async (data)=>{
    const res = await fetch(`${URL}/products`,{
        method:'POST',
        headers:{   
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data),
    });
    return res.json();
}
export const updateProduct = async (id, product) => {
    const res = await fetch(`${URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(product),
    });
    return res.json();
  };
  export const getProductById = async (id) => {
    const res = await fetch(`${URL}/products/${id}`);
    return res.json();
  };



export const deleteProduct = async (id) =>{
    const res = await fetch(`${URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return res.json();  
  
  }

//filters 
 

export const showByPrice = async () =>{
  const res = await fetch(`${URl}/products/price`,{
    method:'GET',
    headers:{
      "Content-Type":"application/json",
    }
  });
  return res.json();
}