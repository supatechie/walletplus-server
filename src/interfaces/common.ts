
export interface IResultType {
    readonly error: boolean;
    readonly message?: string | null;
    readonly data: (object | null)[];
    readonly statusCode: number;
}

export const ISuccessResponse:IResultType = {
    error: false,
    message: "Success",
    data: [],
    statusCode: 200

}
export const IFailedResponse:IResultType = {
    error: true,
    message: "An error occurred",
    data: [],
    statusCode: 406
}