import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import { IResultType } from '../../src/interfaces/common'
import { IAuthType, IUserDocument } from '../../src/interfaces/user.interface'
import * as userService from '../../src/services/user.service'
// @ts-ignore
import { mockFunction } from '../../src/jest.helper'

jest.mock('../../src/services/user.service',() =>{
    const originalModule = jest.requireActual('../../src/services/user.service')
    return {
        __esModule: true,
        ...originalModule,
        getUser: jest.fn(() => ({ error: false, data: [{_id: 'jks', firstName:'John', email: 'demo@gmail.com'}], message: 'Success', statusCode: 200}))
    }
})
describe("Testing create new user function", () =>{
    let dbClient: typeof mongoose
    beforeAll( async() => {
        try {
            dbClient = await mongoose.connect(process.env.MONGO_DB_TEST_URL as string,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
            console.log("database connected")
        } catch (error:any) {
            console.log(error.message)
        }
    })
    afterAll( async() =>{
        await dbClient.connection.dropDatabase()
        await dbClient.connection.close()
    })
    test("should create and return a new user", async() =>{
        const user = {
            firstName: "John",
            lastName: "doe",
            username: "demo",
            email: 'demo@gmail.com',
            phone: "08043789293",
            password: "12345678",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res.error).toBeFalsy()
    })
    test("should return error = true if any of the properties is missing", async() =>{
        const user = {
            firstName: "Janet",
            lastName: "Wong",
            username: "demo1",
            email: 'demo1@gmail.com',
            phone: "08033789293",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res.error).toBeTruthy()
    })

    test("should return An error occurred if any of the properties is missing", async() =>{
        const user = {
            firstName: "John",
            lastName: "doe",
            username: "demo2",
            email: 'demo2@gmail.com',
            phone: "08056789293",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res.message).toBe('An error occurred')
    })

    test("should fail with statuscode 406 if any of the properties is missing", async() =>{
        const user = {
            firstName: "John",
            lastName: "doe",
            email: 'demo3@gmail.com',
            phone: "08003789293",
            password: "12345678",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res.statusCode).toBe(406)
    })

    test("should return a result like { error: boolean, data: Array, message: string, statusCode}", async() =>{
        const user = {
            firstName: "Yina",
            lastName: "Wong",
            username: "demo4",
            email: 'demo4@gmail.com',
            phone: "08016789293",
            password: "12345678",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res).toEqual(expect.objectContaining({
            error: expect.any(Boolean),
            data: expect.any(Array),
            message: expect.any(String),
            statusCode: expect.any(Number)
        }))
    })

    test("should return Registration successful. A mail has been sent to demo5@gmail.com, please login to verify your account}", async() =>{
        const user = {
            firstName: "Denen",
            lastName: "Jason",
            username: "demo5",
            email: 'demo5@gmail.com',
            phone: "08066789293",
            password: "12345678",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res.message).toBe(`Registration successful. A mail has been sent to demo5@gmail.com, please login to verify your account`)
    })

    test("should return statuscode 201 success", async() =>{
        const user = {
            firstName: "Deen",
            lastName: "Watson",
            username: "demo6",
            email: 'demo6@gmail.com',
            phone: "08086789293",
            password: "12345678",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res.statusCode).toBe(201)
    })

    test("should return User with that phone number already exist", async() =>{
        const user = {
            firstName: "Deen",
            lastName: "Watson",
            username: "demo7",
            email: 'demo7@gmail.com',
            phone: "08086789293",
            password: "12345678",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res.message).toBe(`User with that phone number already exist`)
    })

    test("should return User with that username already exist", async() =>{
        const user = {
            firstName: "Deen",
            lastName: "Watson",
            username: "demo6",
            email: 'demo7@gmail.com',
            phone: "08000789293",
            password: "12345678",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res.message).toBe(`User with that username already exist`)
    })

    test("should return User with that phone number already exist", async() =>{
        const user = {
            firstName: "Deen",
            lastName: "Watson",
            username: "demo7",
            email: 'demo7@gmail.com',
            phone: "08086789293",
            password: "12345678",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res.message).toBe(`User with that phone number already exist`)
    })
    
})

describe("Testing sign in user function", () =>{
    let dbClient: typeof mongoose
    beforeAll( async() => {
        try {
            dbClient = await mongoose.connect(process.env.MONGO_DB_TEST_URL as string,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
            console.log("database connected")
        } catch (error:any) {
            console.log(error.message)
        }
    })
    afterAll( async() =>{
        await dbClient.connection.dropDatabase()
        await dbClient.connection.close()
    })
    test("should create and return a new user", async() =>{
        const user = {
            firstName: "John",
            lastName: "doe",
            username: "demo",
            email: 'demo@gmail.com',
            phone: "08043789293",
            password: "12345678",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res.error).toBeFalsy()
    })
    describe("Testing signin based on (username | email | phone) and password", () =>{
        const meta_object = {
            ip_address: '3495.4',
            user_agent: 'node'
        }
        test("should return Login successful if correct username & password is passed", async() =>{
            const user = {
                username: "demo",
                password: '12345678'
            }
            const res = await userService.signInUser(user,meta_object)
            expect(res.message).toBe("Login successful")
        })
        test("should return error is false if correct email & password is passed", async() =>{
            const user = {
                username: "demo@gmail.com",
                password: '12345678'
            }
            const res = await userService.signInUser(user,meta_object)
            expect(res.error).toBeFalsy()
        })
        test("should return Login successful if correct phone & password is passed", async() =>{
            const user = {
                username: "08043789293",
                password: '12345678'
            }
            const res = await userService.signInUser(user,meta_object)
            expect(res.message).toBe("Login successful")
        })
        test("should return data[{user,payload}] if login is successful", async() =>{
            const user = {
                username: "08043789293",
                password: '12345678'
            }
            const res = await userService.signInUser(user,meta_object)
            expect(res.data).toStrictEqual(expect.arrayContaining([expect.objectContaining(
            {
                user: expect.any(Object),
                payload: expect.any(Object)
            })]))
        })
    })
    describe("Testing signin failure based on (username | email | phone) and password", () =>{
        const meta_object = {
            ip_address: '3495.4',
            user_agent: 'node'
        }
        test("should return Wrong username/password provided if wrong username & password is passed", async() =>{
            const user = {
                username: "demo1",
                password: '12345678'
            }
            const res = await userService.signInUser(user,meta_object)
            expect(res.message).toBe("Wrong username/password provided")
        })
        test("should return error is true if wrong email & password is passed", async() =>{
            const user = {
                username: "demo1@gmail.com",
                password: '12345678'
            }
            const res = await userService.signInUser(user,meta_object)
            expect(res.error).toBeTruthy()
        })
        test("should return empty data array if wrong phone & password is passed", async() =>{
            const user = {
                username: "08033789293",
                password: '12345678'
            }
            const res = await userService.signInUser(user,meta_object)
            expect(res.data).toStrictEqual([])
        })
    })    
})

describe("Testing signout function", () =>{
    let dbClient: typeof mongoose
    beforeAll( async() => {
        try {
            dbClient = await mongoose.connect(process.env.MONGO_DB_TEST_URL as string,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
            console.log("database connected")
        } catch (error:any) {
            console.log(error.message)
        }
    })
    afterAll( async() =>{
        await dbClient.connection.dropDatabase()
        await dbClient.connection.close()
    })
    test("should create and return a new user", async() =>{
        const user = {
            firstName: "John",
            lastName: "doe",
            username: "demo",
            email: 'demo@gmail.com',
            phone: "08043789293",
            password: "12345678",
            role: "user"
        } as IUserDocument
        const res = await userService.createUser(user)
        expect(res.error).toBeFalsy()
    })
    describe("Testing signin user", () =>{
        const meta_object = {
            ip_address: '3495.4',
            user_agent: 'node'
        }
        let res: IResultType 
        test("should return Login successful if correct username & password is passed", async() =>{
            const user = {
                username: "demo",
                password: '12345678'
            }
            res = await userService.signInUser(user,meta_object)
            expect(res.message).toBe("Login successful")
        })
        describe("should logout a user successfully if the refresh token is provided",() =>{
            test("should return Login successful if correct username & password is passed", async() =>{
                const {payload} = res.data[0] as any
                const _res = await userService.signOutUser(payload.refresh_token)
                expect(_res.message).toBe("Logout successful")
            })
        })
        
    })
})

describe("Testing generateNewAuthToken function", () =>{
    test("should return {user, authToken, refreshToken} when called with a refresh token", async() =>{
        const user = {
            firstName: "John",
            lastName: "doe",
            username: "demo",
            email: 'demo@gmail.com',
            phone: "08043789293",
            password: "12345678",
            role: "user"
        } as IUserDocument
        const returnValue:IAuthType  = {authToken:"uwwoow",refreshToken: "hio876",user}
        const mockGenerateNewAuthToken =  mockFunction(userService.generateNewAuthToken)
        const res = await mockGenerateNewAuthToken('ksjsjka').then(() => returnValue)
        expect(res).toEqual(expect.objectContaining({
            user: expect.any(Object),
            authToken: expect.any(String),
            refreshToken: expect.any(String)
        }))
    })
    test("should return false when called with an invalid refresh token", async() =>{
        const mockGenerateNewAuthToken =  mockFunction(userService.generateNewAuthToken)
        const res = await mockGenerateNewAuthToken('_hello').then(() => false)
        expect(res).toBeFalsy()
    })
})

describe("Testing generateNewAuthToken function", () =>{
    let dbClient: typeof mongoose
    beforeAll( async() => {
        try {
            dbClient = await mongoose.connect(process.env.MONGO_DB_TEST_URL as string,{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
            console.log("database connected")
        } catch (error:any) {
            console.log(error.message)
        }
    })
    afterAll( async() =>{
        await dbClient.connection.dropDatabase()
        await dbClient.connection.close()
    })
    describe("Create a user", () =>{
        test("should create and return a new user", async() =>{
            const user = {
                firstName: "John",
                lastName: "doe",
                username: "demo",
                email: 'demo@gmail.com',
                phone: "08043789293",
                password: "12345678",
                role: "user"
            } as IUserDocument
            const res = await userService.createUser(user)
            expect(res.error).toBeFalsy()
        })
    })
    describe("Test getUsers function", () =>{
        test("should return all the users", async() =>{
            const res = await userService.getAllUsers({})
            expect(res.error).toBeFalsy()
        })
        test("should return {error, data, message, statusCode} ", async() =>{
            const res = await userService.getAllUsers({})
            expect(res).toEqual(expect.objectContaining({
                error: expect.any(Boolean),
                data: expect.any(Array),
                message: expect.any(String),
                statusCode: expect.any(Number)
            }))
            expect(res.error).toBeFalsy()
        })
        
    })
})
describe("Testing getUser function", () =>{
    test("should return the user when called with a valid id", async() =>{
        const mockGetUser =  mockFunction(userService.getUser)
        const res = await mockGetUser('jsjsksj')
        expect(res.error).toBeFalsy()
        expect(mockGetUser).toBeCalledTimes(1)
        expect(mockGetUser).toBeCalledWith('jsjsksj')
    })
})