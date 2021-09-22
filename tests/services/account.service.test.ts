import dotenv from 'dotenv'
dotenv.config()
import { IAccountDocument } from '../../src/interfaces/account.interface'
import { IResultType } from '../../src/interfaces/common'
import * as accountService from '../../src/services/account.service'
// @ts-ignore
import { mockFunction } from '../../src/jest.helper'

jest.mock('../../src/services/account.service')

describe("Testing createAccount function", () =>{
    test("should return Account created successfully", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Account created successfully"}
        const payload = { balance: 5000, userId: "jdhdhdg", pin: 12345}
        const mockCreateAccount =  mockFunction(accountService.createAccount)
        const response = mockCreateAccount.mockResolvedValue(result)
        const res = await response(payload)
        expect(res.error).toBeFalsy()
    })
    test("should return number of times called", async() =>{
        const mockCreateAccount =  mockFunction(accountService.createAccount)
        const payload = { balance: 5000, userId: "jdhdhdg", pin: 12345} as IAccountDocument
        mockCreateAccount(payload)
        expect(mockCreateAccount).toBeCalledTimes(2)
        expect(mockCreateAccount.name).toBe('createAccount')
    })
})

describe("Testing getUserAccount function", () =>{
    beforeEach(() =>{
        jest.clearAllMocks()
    })
    test("should return Success", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Success"}
        const mockGetUserAccount =  mockFunction(accountService.getUserAccount)
        const response = mockGetUserAccount.mockResolvedValueOnce(result)
        const res = await response('shdkakdj')
        expect(res.message).toBe("Success")
    })
    test("should return number of times called and the name", async() =>{
        const mockGetUserAccount =  mockFunction(accountService.getUserAccount)
        mockGetUserAccount('dhdgs')
        expect(mockGetUserAccount).toBeCalledTimes(1)
        expect(mockGetUserAccount.name).toBe('getUserAccount')
        expect(mockGetUserAccount).toBeCalledWith('dhdgs')

    })
})

describe("Testing updateAccountPin function", () =>{
    beforeEach(() =>{
        jest.clearAllMocks()
    })
    test("should return Your pin is updated successfully", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Your pin is updated successfully"}
        const payload:[string,number] = ['shsh', 6738]
        const mockUpdateAccountPin =  mockFunction(accountService.updateAccountPin)
        const response = mockUpdateAccountPin.mockResolvedValueOnce(result)
        const res = await response(...payload)
        expect(res.message).toBe("Your pin is updated successfully")
    })
    test("should return No wallet found", async() =>{
        const result:IResultType = { error: true, data: [], statusCode: 404,message: "No wallet found"}
        const payload:[string,number] = ['shsh', 6738]
        const mockUpdateAccountPin =  mockFunction(accountService.updateAccountPin)
        const response = mockUpdateAccountPin.mockResolvedValueOnce(result)
        const res = await response(...payload)
        expect(res.message).toBe("No wallet found")
        expect(res.error).toBeTruthy()
        expect(res.statusCode).toBe(404)

    })
    test("should return number of times called and the name", async() =>{
        const payload:[string,number] = ['shsh', 6738]
        const mockUpdateAccountPin =  mockFunction(accountService.updateAccountPin)
        mockUpdateAccountPin(...payload)
        expect(mockUpdateAccountPin).toBeCalledTimes(1)
        expect(mockUpdateAccountPin.name).toBe('updateAccountPin')
        expect(mockUpdateAccountPin).toBeCalledWith(...payload)

    })
})

describe("Testing depositMoney function", () =>{
    beforeEach(() =>{
        jest.clearAllMocks()
    })
    test("should return Wallet funded successfully", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Wallet funded successfully"}
        const payload = {userId:'shsh', pin: 3738, amount: 5000}
        const mockSendMoney =  mockFunction(accountService.depositMoney)
        const response = mockSendMoney.mockResolvedValueOnce(result)
        const res = await response(payload)
        expect(res.message).toBe("Wallet funded successfully")
    })
    test("should return Invalid pin, please try again", async() =>{
        const result:IResultType = { error: true, data: [], statusCode: 401,message: "Invalid pin, please try again"}
        const payload = {userId:'shsh', pin: 3738, amount: 5000}
        const mockSendMoney =  mockFunction(accountService.depositMoney)
        const response = mockSendMoney.mockResolvedValueOnce(result)
        const res = await response(payload)
        expect(res.message).toBe("Invalid pin, please try again")
        expect(res.error).toBeTruthy()
        expect(res.statusCode).toBe(401)

    })
    test("should return number of times called and the name", async() =>{
        const payload = {userId:'shsh', pin: 3738, amount: 5000}
        const mockSendMoney =  mockFunction(accountService.depositMoney)
        mockSendMoney(payload)
        expect(mockSendMoney).toBeCalledTimes(1)
        expect(mockSendMoney.name).toBe('depositMoney')
        expect(mockSendMoney).toBeCalledWith(payload)

    })
})

describe("Testing sendMoney function", () =>{
    beforeEach(() =>{
        jest.clearAllMocks()
    })
    test("should return Money sent successfully", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Money sent successfully"}
        const payload = {userId:'shsh', pin: 3738, amount: 5000,email: "demo@gmail.com"}
        const mockTransferMoney =  mockFunction(accountService.sendMoney)
        const response = mockTransferMoney.mockResolvedValueOnce(result)
        const res = await response(payload)
        expect(res.message).toBe("Money sent successfully")
    })
    test("should return Invalid pin, please try again", async() =>{
        const result:IResultType = { error: true, data: [], statusCode: 406,message: "Transfer error, you don't have enough fund"}
        const payload = {userId:'shsh', pin: 3738, amount: 5000,email: "demo@gmail.com"}
        const mockTransferMoney =  mockFunction(accountService.sendMoney)
        const response = mockTransferMoney.mockResolvedValueOnce(result)
        const res = await response(payload)
        expect(res.message).toBe("Transfer error, you don't have enough fund")
        expect(res.error).toBeTruthy()
        expect(res.statusCode).toBe(406)

    })
    test("should return number of times called and the name", async() =>{
        const payload = {userId:'shsh', pin: 3738, amount: 5000,email: "demo@gmail.com"}
        const mockTransferMoney =  mockFunction(accountService.sendMoney)
        mockTransferMoney(payload)
        expect(mockTransferMoney).toBeCalledTimes(1)
        expect(mockTransferMoney.name).toBe('sendMoney')
        expect(mockTransferMoney).toBeCalledWith(payload)

    })
})

describe("Testing transferMoney function", () =>{
    beforeEach(() =>{
        jest.clearAllMocks()
    })
    test("should return Transfer successful", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Transfer successful"}
        const payload = {userId:'shsh', pin: 3738, amount: 5000,accountNumber: 98782829}
        const mockDepositMoney =  mockFunction(accountService.transferMoney)
        const response = mockDepositMoney.mockResolvedValueOnce(result)
        const res = await response(payload)
        expect(res.message).toBe("Transfer successful")
    })
    test("should return Invalid pin, please try again", async() =>{
        const result:IResultType = { error: true, data: [], statusCode: 406,message: "Transfer error, you don't have enough fund"}
        const payload = {userId:'shsh', pin: 3738, amount: 5000,accountNumber: 98782829}
        const mockDepositMoney =  mockFunction(accountService.transferMoney)
        const response = mockDepositMoney.mockResolvedValueOnce(result)
        const res = await response(payload)
        expect(res.message).toBe("Transfer error, you don't have enough fund")
        expect(res.error).toBeTruthy()
        expect(res.statusCode).toBe(406)

    })
    test("should return number of times called and the name", async() =>{
        const payload = {userId:'shsh', pin: 3738, amount: 5000,accountNumber: 98782829}
        const mockDepositMoney =  mockFunction(accountService.transferMoney)
        mockDepositMoney(payload)
        expect(mockDepositMoney).toBeCalledTimes(1)
        expect(mockDepositMoney.name).toBe('transferMoney')
        expect(mockDepositMoney).toBeCalledWith(payload)

    })
})

describe("Testing withdrawMoney function", () =>{
    beforeEach(() =>{
        jest.clearAllMocks()
    })
    test("should return Withdrawal successful", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Withdrawal successful"}
        const payload = {userId:'shsh', pin: 3738, amount: 5000,accountNumber: 98782829}
        const mockWithdrawMoney =  mockFunction(accountService.withdrawMoney)
        const response = mockWithdrawMoney.mockResolvedValueOnce(result)
        const res = await response(payload)
        expect(res.message).toBe("Withdrawal successful")
    })
    test("should return Withdrawal error, you don't have enough fund", async() =>{
        const result:IResultType = { error: true, data: [], statusCode: 406,message: "Withdrawal error, you don't have enough fund"}
        const payload = {userId:'shsh', pin: 3738, amount: 5000,accountNumber: 98782829}
        const mockWithdrawMoney =  mockFunction(accountService.withdrawMoney)
        const response = mockWithdrawMoney.mockResolvedValueOnce(result)
        const res = await response(payload)
        expect(res.message).toBe("Withdrawal error, you don't have enough fund")
        expect(res.error).toBeTruthy()
        expect(res.statusCode).toBe(406)

    })
    test("should return number of times called and the name", async() =>{
        const payload = {userId:'shsh', pin: 3738, amount: 5000,accountNumber: 98782829}
        const mockWithdrawMoney =  mockFunction(accountService.withdrawMoney)
        mockWithdrawMoney(payload)
        expect(mockWithdrawMoney).toBeCalledTimes(1)
        expect(mockWithdrawMoney.name).toBe('withdrawMoney')
        expect(mockWithdrawMoney).toBeCalledWith(payload)

    })
})