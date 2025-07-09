import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../styles/auth.css";

const LoginPage=()=>{
    const [identifier, setIdentifier]=useState("");
    const [password,setPassword]=useState("");
    const [showPassword, setShowPassword] = useState(false);
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
        console.log ("Login response data: ", data);

        if (response.ok){
            alert("Login Successful");
            // console.log("identifier:", data.identifier);
            localStorage.setItem("token", data.access_token);
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
                    value={identifier}
                    onChange={(e)=>setIdentifier(e.target.value)}                
                    required
                />
                <div className="password-input-wrapper">
                    <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password" 
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}                 
                        required
                    />
                    <button
                        type="button"
                        className="show-password-btn"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                </div>

                <button type="submit">Login</button>
                <p>Don't have an account yet? <a href="/signup">Sign up</a></p>
            </form>
        </div>
    )
};

export default LoginPage;

