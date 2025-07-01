import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const LoginPage=()=>{
    const [identifier, setIdentifier]=useState("");
    const [password,setPassword]=useState("");
    const navigate=useNavigate(); 

    const handleLogin=async(e)=>{
        e.preventDefault();
        console.log("identifier:", identifier);

    try {
        const response = await fetch("http://localhost:5000/api/auth/login",{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({identifier,password}),
        });

        const data = await response.json();

        if (response.ok){
            alert("Login Successful");
            console.log("identifier:", data.identifier);
            localStorage.setItem("token", data.token);
            navigate("/dashboard"); 
        }
        else {
            alert(data.message || "Login Failed")
        }
    }
    catch (error){
        console.error("Login error:", error);
        alert("Server error. Try again");
    }
};
    
    return(
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                type="text"
                placeholder="Enter email or username"
                onChange={(e)=>setIdentifier(e.target.value)}
                value={identifier}
                required
                 />
                 <input 
                 type="password"
                 placeholder="Enter password" 
                 onChange={(e)=>setPassword(e.target.value)}
                 value={password}
                 required
                 />

                 <button type="submit">Login</button>
                 <p>Don't have an account yet? <a href="/signup">Sign up</a></p>
            </form>
        </div>
    )
};

export default LoginPage;

