export interface TypedResponse<responseType> {
    isSuccess : boolean,
    message : string,
    data : responseType | null
}