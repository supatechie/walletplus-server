import jwt from "jsonwebtoken"

/**
 * Receives and payoad and sign return a token
 * @param payload object | string | buffer
 * @param securityKey string
 * @param options jwt.SignOptions | undefined
 * @returns string | null
 */
export const signToken = (payload:object, securityKey: string,options?: jwt.SignOptions | undefined) =>{
    try {
        if(!payload || !securityKey) return null
        let token = jwt.sign(payload,securityKey,options)
        return token
    } catch (error) {
        return null
    }
}
/**
 * Verify a jwt token given a token and security key
 * @param token any jwt token
 * @param securityKey the key used to sign the obj
 * @returns  string | null | jwtPayload
 */
export const verifyToken = (token:string, securityKey: string) =>{
    try {
        if(!token || !securityKey) {
            return {isValid: false, payload: null, expired: true}
        }
        let user = jwt.verify(token,securityKey)
        return {isValid: true, payload: user, expired: false}
    } catch (error) {
        return {isValid: false, payload: null, expired: true}
    }
}
/**
 * Decode a jwt token
 * @param token any jwt token to be decoded
 * @returns string | null | JwtPayload
 */
export const decodeToken = (token:string) =>{
    try {
        let payload = jwt.decode(token)
        return {isValid: true, payload, expired: false}
    } catch (error: any) {
        return {isValid: false, payload: null, expired: error.message === "jwt expired"}
    }
}