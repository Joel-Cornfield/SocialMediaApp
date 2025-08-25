import { createContext, useReducer, useEffect, useState } from "react";

export const AuthContext = createContext();
export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN': {
            return { user: action.payload };
        }
        case 'LOGOUT': {
            return { user: null };
        }
        case 'UPDATE': {
            return { user: { ...state.user, ...action.payload } };
        }
        default:
            state;
    }
};

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loading }}>
            {children}
        </AuthContext.Provider>
    );
};