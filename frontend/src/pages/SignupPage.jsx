import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const SignupPage=()=>{
    const [email, setEmail]=useState("");
    const[username, setUsername]=useState("");
    const [password, setPassword]=useState("");
    const [confirmPassword, setConfirmPassword]=useState("");
    const navigate=useNavigate();

    const handleSignup=async(e)=>{
        e.preventDefault();

        if (password !== confirmPassword){
            alert("Errors: Passwords do not match")
            return;
        }
        try {
            const response =await fetch ("http://localhost:5000/api/auth/signup",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                    password
                })
         });

         const data = await response.json();


         if (response.ok){
            alert("Signup successful");
            navigate("/");
         }else{
            alert(data.error || data.message || "Signup failed");
         }
        }
        catch (err) {
            console.error("Signup error: ", err);
            alert("Something went wrong. Please try again");
        }
    };

    return(
        <div className="auth-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
                <input
                type="email"
                placeholder="Enter email"
                onChange={(e)=> setEmail(e.target.value)}
                value={email}
                required
                />
                <br/>
                <input 
                type="text"
                placeholder="Enter username"
                onChange={(e)=>setUsername(e.target.value)}
                value={username}
                required
                />
                <br/>
                <input 
                type="password"
                placeholder="Enter password"
                onChange={(e)=> setPassword(e.target.value)} 
                value={password}
                required
                />
                <br/>

                <input 
                type="password"
                placeholder="Enter password again"
                onChange={(e)=> setConfirmPassword(e.target.value)} 
                value={confirmPassword}
                required
                />
                <br/>

                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account?<a href="/">Login</a></p>
        </div>
    );
};

export default SignupPage;