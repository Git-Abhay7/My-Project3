
module.exports = {

    commonResponse:(res,statusCode,result,message)=>{
    
        return res.json({
    
            responseCode:statusCode,
            responseMessage:message || "",
            result:result || "",
        })
    },
       sendResponseWithPagination:(responseObj, responseCode, responseMessage, data, paginationData)=>{
        return responseObj.send({'responseCode':responseCode,'responseMessage':responseMessage,result:data,paginationData:paginationData || ''})
       },
       sendResponseWithData:(responseObj,responseCode,responseMessage,data,token)=>{
        return responseObj.send({'responseCode':responseCode,'responseMessage':responseMessage,result:data, token:tokn});
       },
       sendResponseWithoutData: (responseObj, responseCode, responseMessage) => {
        return responseObj.send({'responseCode':responseCode,'responseMessage':responseMessage});
    }
    
    }