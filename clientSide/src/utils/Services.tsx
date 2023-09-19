export const baseUrl = "http://localhost:8080/api";

export const postRequest = async (url:string ,body:any)=>{
    const response = await fetch(url,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body
    })
    const data = await response.json();
    let message;
    if(!response.ok){
        if(data?.message){
            message = data.message; 
        }else{
            message = data;
        }
        return { error:true ,message };
    }

    return data; 
}

export const getRequest = async (url:string)=>{
    const response = await fetch(url);
    const data:any = response.json();
    let message;
    if(!response.ok){
        if(data?.message){
            message = data.message; 
        }
        return { error:true ,message };
    }

    return data; 
}