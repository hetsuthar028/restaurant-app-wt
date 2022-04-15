class ApiError {
    constructor(status, message, payload){
        this.status = status;
        this.message = message;
        this.payload = payload;
    }

    static badRequest(message){
        return new ApiError(400, message);
    }

    static unauthenticatedRequest(message){
        return new ApiError(401, message);
    }

    static unauthorizedRequest(message){
        return new ApiError(403, message);
    }

    static notFound(message){
        return new ApiError(404, message);
    }

    static apiInternal(message){
        return new ApiError(500, message)
    }

    static sessionTimeout(message){
        return new ApiError(440, message);
    }
}

module.exports = ApiError;