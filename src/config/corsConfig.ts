export const allowedDomains = () => {
    if(process.env.NODE_ENV === "production"){
        return [
            "https://walletplus.supatechie.ga",
            'https://api-walletplus.supatechie.ga', 
            "api-walletplus.supatechie.ga",
            "supatechie.com",
            "walletplus.supatechie.ga"]
    }
    return ["http://localhost:3000",'localhost'] 
}