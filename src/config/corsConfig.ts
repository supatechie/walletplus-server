export const allowedDomains = () => {
    if(process.env.NODE_ENV === "production"){
        return ["https://supawalletplus.herokuapp.com",'https://api-supawalletplus.herokuapp.com', "api-supawalletplus.herokuapp.com"]
    }
    return ["http://localhost:3000",'localhost'] 
}