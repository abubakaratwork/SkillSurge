export interface ResponseType<T> {
    isSuccess: boolean,
    message: string,
    data: T,
}