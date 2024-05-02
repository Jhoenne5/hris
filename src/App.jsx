import React, { useState } from 'react';
import Cookies  from 'js-cookie'

function App() {
  const [formData, setFormData] = useState({
    RegionCode: '',
    Email: '',
    Password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://localhost:7267/api/Authentication/user/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }); 
      const data = await response.json();

      console.log("Login response:", data);
      

      
      const payload = {
        id: data.id,
        email: data.email
      }
      console.log("Payload", payload);


      if(response.status === 200) {
        const tokenResponse = await fetch("https://localhost:7267/api/Authentication/JWT", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: data.id,
            email: data.email
          })
        
          
        });
          

        const tokenData = await tokenResponse.json();
        console.log("Token response:", tokenData); 

      

        localStorage.setItem('token',tokenData.token);

        Cookies.set('token', tokenData.token, {expires: 1});
     
      } else {
        setError('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96 mx-auto mt-[10rem]">
      <form onSubmit={handleSubmit}>
        {error && <div className="text-red-500">{error}</div>}
        <div className="mb-4">
          <label htmlFor="RegionCode" className="block text-gray-700 text-sm font-bold mb-2">RI:</label>
          <input type="text" name="RegionCode" value={formData.RegionCode} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="Email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input type="text" name="Email" value={formData.Email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-6">
          <label htmlFor="Password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input type="password" name="Password" value={formData.Password} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="flex items-center justify-between">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Login</button>
        </div>
      </form>
    </div>
  );
}

export default App;
