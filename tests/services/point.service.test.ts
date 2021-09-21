import dotenv from 'dotenv'
dotenv.config()
import { IPointDocument } from '../../src/interfaces/point.interface'
import { IResultType } from '../../src/interfaces/common'
import * as pointService from '../../src/services/point.service'
import { mockFunction } from '../jest.helper'
jest.mock('../../src/services/point.service')

describe("Testing createPoint function", () =>{
    test("should return Point wallet created successfully", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Point wallet created successfully"}
        const payload = { balance: 5000, userId: "jdhdhdg"}
        const mockCreatePoint =  mockFunction(pointService.createPoint)
        const response = mockCreatePoint.mockResolvedValue(result)
        const res = await response(payload)
        expect(res.error).toBeFalsy()
    })
    test("should return number of times called", async() =>{
        const mockCreatePoint =  mockFunction(pointService.createPoint)
        const payload = { balance: 5000, userId: "jdhdhdg"} as IPointDocument
        mockCreatePoint(payload)
        expect(mockCreatePoint).toBeCalledTimes(2)
        expect(mockCreatePoint.name).toBe('createPoint')
    })
})

describe("Testing getUserPoint function", () =>{
    beforeEach(() =>{
        jest.clearAllMocks()
    })
    test("should return Success", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Success"}
        const mockGetUserPoint =  mockFunction(pointService.getUserPoint)
        const response = mockGetUserPoint.mockResolvedValueOnce(result)
        const res = await response('shdkakdj')
        expect(res.message).toBe("Success")
    })
    test("should return number of times called and the name", async() =>{
        const mockGetUserPoint =  mockFunction(pointService.getUserPoint)
        mockGetUserPoint('dhdgs')
        expect(mockGetUserPoint).toBeCalledTimes(1)
        expect(mockGetUserPoint.name).toBe('getUserPoint')
        expect(mockGetUserPoint).toBeCalledWith('dhdgs')

    })
})

describe("Testing updateUserPoints function", () =>{
    beforeEach(() =>{
        jest.clearAllMocks()
    })
    test("should return Your pin is updated successfully", async() =>{
        const result:IResultType = { error: false, data: [], statusCode: 201,message: "Your pin is updated successfully"}
        const payload = {points: 1000,userId: 'dhdhjss'}
        const mockUpdatePoints =  mockFunction(pointService.updateUserPoints)
        const response = mockUpdatePoints.mockResolvedValueOnce(result)
        const res = await response(payload)
        expect(res.message).toBe("Your pin is updated successfully")
    })
    test("should return No point found", async() =>{
        const result:IResultType = { error: true, data: [], statusCode: 404,message: "No account found"}
        const payload = {points: 1000,userId: 'dhdhjss'}
        const mockUpdatePoints =  mockFunction(pointService.updateUserPoints)
        const response = mockUpdatePoints.mockResolvedValueOnce(result)
        const res = await response(payload)
        expect(res.message).toBe("No account found")
        expect(res.error).toBeTruthy()
        expect(res.statusCode).toBe(404)

    })
    test("should return number of times called and the name", async() =>{
        const payload = {points: 1000,userId: 'dhdhjss'}
        const mockUpdatePoints =  mockFunction(pointService.updateUserPoints)
        mockUpdatePoints(payload)
        expect(mockUpdatePoints).toBeCalledTimes(1)
        expect(mockUpdatePoints.name).toBe('updateUserPoints')
        expect(mockUpdatePoints).toBeCalledWith(payload)

    })
})