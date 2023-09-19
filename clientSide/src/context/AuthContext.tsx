import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/Services";

export interface User {
    name: string;
    email:string;
    password:string;
}

export interface AuthUser{
    user:User | null;
    registerInfo:User;
    registerUpdateInfo:any;
    isRegisterLoading:boolean | null;
    registerError:any;
    registerUser:any;
    logoutUser:VoidFunction;
    loginUser:any;
    loginError:any;
    loginInfo:any;
    loginUpdateInfo:any;
    loginLoading:any;
}

export const AuthContext = createContext<AuthUser | undefined>(undefined);

export const AuthContextProvider = ({ children }: any) => {
    const [user ,setUser] = useState<User | null>(null);
    const [registerError ,setRegisterError] = useState(null);
    const [isRegisterLoading ,setRegisterLoading] = useState<boolean | null>(null);
    const [registerInfo,setRegisterInfo] = useState<User>({
        name:"",
        email:"",
        password:""
    })
    const [loginInfo,setLoginInfo] = useState({
        email:"",
        password:""
    })
    const [loginError ,setLoginError] = useState(null);
    const [loginLoading ,setLoginLoading] = useState<boolean | null>(null);

    useEffect(()=>{
        const user:string | null = localStorage.getItem("User");
        if(user) 
            setUser(JSON.parse(user));

    },[])

    const registerUpdateInfo = useCallback((info:User)=>{
        setRegisterInfo(info);
    },[]);
    const loginUpdateInfo = useCallback((info:User)=>{
        setLoginInfo(info);
    },[]);

    const registerUser = useCallback(async(e:React.MouseEvent)=>{
        e.preventDefault();
        setRegisterLoading(true);
        setRegisterError(null);
        const response =  await postRequest(`${baseUrl}/users/register`,JSON.stringify(registerInfo));
        if(response.error){
            return setRegisterError(response)
        }
        setRegisterLoading(false);
        localStorage.setItem("User",JSON.stringify(response))
        setUser(response);
    } ,[registerInfo])

    const loginUser = useCallback(async(e:React.MouseEvent)=>{
        e.preventDefault();
        setLoginLoading(true);
        setLoginError(null);
        const response =  await postRequest(`${baseUrl}/users/login`,JSON.stringify(loginInfo));
        setLoginLoading(false);
        if(response.error){
            return setLoginError(response)
        }
        localStorage.setItem("User",JSON.stringify(response))
        setUser(response);

    },[loginInfo]);

    const logoutUser = useCallback(()=>{
        localStorage.removeItem('User');
        setUser(null);
    },[])

    return (
    <AuthContext.Provider 
        value={{
            user,
            registerInfo,
            registerUpdateInfo,
            registerError,
            isRegisterLoading,
            registerUser,
            logoutUser,
            loginUser,
            loginError,
            loginInfo,
            loginUpdateInfo,
            loginLoading
        }}
        >
        {children}
    </AuthContext.Provider>
)};

