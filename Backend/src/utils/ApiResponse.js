class ApiResponse{
    constructor(data,message,statusCode){
        this.statusCode=statusCode
        this.status=statusCode<400
        this.message=message
        this.data=data
    }
}

export default ApiResponse