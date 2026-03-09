export interface TypedResponse<responseType> {
    success : boolean,
    message : string,
    data : responseType | null
}