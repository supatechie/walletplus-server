export const allowedDomains = () => {
    if(process.env.NODE_ENV === "production"){
        return ["https://supatechie.ga",'app.supatechie.ga']
    }
    return ["http://localhost:3000",'localhost'] 
}