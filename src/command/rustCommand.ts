export enum RustCommand {
    greet='greet',
    log_axios_message='log_axios_message',
    close_splashscreen='close_splashscreen'
}

export interface RustCommandReturnType {
    greet:string;
    close_splashscreen:void;
    log_axios_message:void;
}