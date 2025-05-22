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
  const isFormData = data instanceof FormData;
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  const res = await fetch(`${URL}/products`, {
    method: "POST",
    headers: headers,
    body: isFormData ? data : JSON.stringify(data),
  });
  return res.json();
};

export const updateProduct = async (id, data, token) => {
  const isFormData = data instanceof FormData;
  
  console.log(`updateProduct API call: id=${id}, isFormData=${isFormData}`);
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  
  try {
    console.log(`Making ${isFormData ? 'FormData' : 'JSON'} PUT request to ${URL}/products/${id}`);
    
    const res = await fetch(`${URL}/products/${id}`, {
      method: "PUT",
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    
    console.log(`Response status: ${res.status}`);
    
    const responseData = await res.json();
    console.log('Response data:', responseData);
    
    return responseData;
  } catch (error) {
    console.error(`API request error: ${error.message}`);
    return { error: true, message: error.message };
  }
};

export const getProductById = async (id, token) => {
  const res = await fetch(`${URL}/products/${id}`, {
    method: "GET",
    headers: {
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