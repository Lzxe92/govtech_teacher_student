// ------------------------------------------------------------------------------------------
// Common Error
// ------------------------------------------------------------------------------------------
/**
 *
 * @apiDefine ResponseObjectInvalidTokenError
 * @apiError {Object}   response            Response  information Object.
 * @apiError {String}   response.status     <code>Status</code> of the Action. <code>0</code> = Failed, <code>1</code> = Succeed
 * @apiError {String}   response.auth       <code>auth</code> is the authentication status,
 * <br /><code>-1</code>  = Player is not permitted for this action. This might be JWT token used is not permitted for the action
 * <br /><code>0</code>  = failed authentication
 * <br /><code>1</code>  = pass authentication
 * @apiError {String}   response.message    Message of action
 *
 * @apiErrorExample {json} Error: Token invalid signature:
 * HTTP/1.1 401 Not Authenticated
 *
 {
     "response": {
         "auth": 0,
         "message": "Invalid Token",
         "status": 0
     }
 }
 *
 *
 */
