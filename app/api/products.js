//this is for the fetching for the products
import { URL } from "./configuration";

export const getProducts = async (token) => {

  const res = await fetch(`${URL}/products`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      
    },
  });
  return res.json();
};

export const createProduct = async (token, data) => {
  const res = await fetch(`${URL}/products`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

// export const createStore = async (token, data)=>{
//   const res = await fetch(`${URL}/stores`,{
//       method:'POST',
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body:JSON.stringify(data),
//   });
//   return res.json();
// }
export const updateProduct = async (id, product, token) => {
  const res = await fetch(`${URL}/products/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  });
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${URL}/products/${id}`, {
    headers: {
      method: "GET",
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export const deleteProduct = async (id, token) => {
  const res = await fetch(`${URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

//filters

export const showByPrice = async (token) => {
  const res = await fetch(`${URL}/products/price`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
