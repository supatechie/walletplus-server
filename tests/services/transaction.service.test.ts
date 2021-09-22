import dotenv from 'dotenv'
dotenv.config()
import { ITransactionDocument } from '../../src/interfaces/transaction.interface'
import { IResultType } from '../../src/interfaces/common'
import * as transactionService from '../../src/services/transaction.service'
// @ts-ignore
import { mockFunction } from '../../src/jest.helper'
jest.mock('../../src/services/transaction.service')

describe("Testing createTransaction function", () =>{
    test("should return Point wallet created successfully", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Transaction inserted successfully"}
        const payload = { fromUser: "dhj", toUser: "jdhdhdg", eventType: 'deposit', type: 'account' } as unknown as ITransactionDocument
        const mockCreatePoint =  mockFunction(transactionService.createTransaction)
        const response = mockCreatePoint.mockResolvedValue(result)
        const res = await response(payload)
        expect(res.error).toBeFalsy()
    })
    test("should return number of times called", async() =>{
        const mockCreatePoint =  mockFunction(transactionService.createTransaction)
        const payload = { fromUser: "dhj", toUser: "jdhdhdg", eventType: 'deposit', type: 'account' } as unknown as ITransactionDocument
        mockCreatePoint(payload)
        expect(mockCreatePoint).toBeCalledTimes(2)
        expect(mockCreatePoint.name).toBe('createTransaction')
    })
})

describe("Testing getATransaction function", () =>{
    beforeEach(() =>{
        jest.clearAllMocks()
    })
    test("should return Success", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Success"}
        const mockGetATransaction =  mockFunction(transactionService.getATransaction)
        const response = mockGetATransaction.mockResolvedValueOnce(result)
        const res = await response('shdkakdj')
        expect(res.message).toBe("Success")
    })
    test("should return number of times called and the name", async() =>{
        const mockGetATransaction =  mockFunction(transactionService.getATransaction)
        mockGetATransaction('dhdgs')
        expect(mockGetATransaction).toBeCalledTimes(1)
        expect(mockGetATransaction.name).toBe('getATransaction')
        expect(mockGetATransaction).toBeCalledWith('dhdgs')

    })
})

describe("Testing getTransactions function", () =>{
    beforeEach(() =>{
        jest.clearAllMocks()
    })
    test("should return Success", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Success"}
        const mockGetTransactions =  mockFunction(transactionService.getTransactions)
        const response = mockGetTransactions.mockResolvedValueOnce(result)
        const res = await response({},{})
        expect(res.message).toBe("Success")
    })
    test("should return number of times called and the name", async() =>{
        const mockGetTransactions =  mockFunction(transactionService.getTransactions)
        mockGetTransactions({},{})
        expect(mockGetTransactions).toBeCalledTimes(1)
        expect(mockGetTransactions.name).toBe('getTransactions')
    })
})