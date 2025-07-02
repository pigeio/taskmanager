import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="mb-4">
            <label className="text-[13px] text-slate-800 block mb-1">
                {label}
            </label>
            
            <div className="input-box flex items-center border border-slate-300 rounded-md p-2 focus-within:border-primary transition">
                <input
                    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                    value={value}
                    onChange={(e) => onChange(e)}
                />

                {type === "password" && (
                    <button 
                        type="button" 
                        onClick={toggleShowPassword}
                        className="ml-2 text-slate-400 hover:text-primary transition"
                    >
                        {showPassword ? (
                            <FaRegEyeSlash size={18} />
                        ) : (
                            <FaRegEye size={18} />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Input;


