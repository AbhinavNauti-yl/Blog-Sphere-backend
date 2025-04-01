class apiError {
    constructor(
        statusCode,
        message="something went wrong",
        error= [],
        stack= ""
    ){
        this.statusCode = statusCode
        this.message = message
        this.error = error
        this.success = false
        
        if(stack){
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default apiError