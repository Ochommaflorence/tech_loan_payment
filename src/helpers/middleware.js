import Users from "../User/user_model";
import {handleResponse, decodeToken, rolesAcceptable} from "./util";

class AuthCheck {
     // any user with valid token would pass here

     static CheckAuthstatus(req,res) {
         const bearerHeader = req.header("Authorization");
         if(typeof bearerHeader !== "undefined") {
             const bearer = bearerHeader.split();
             const bearerToken = bearer[1];
             req.token = bearerToken;

             const user = decodeToken(bearerToken);

             req.user = user;
             return next();
         }
         return handleResponse(res, 403, "Unauthorized access, please login");
     };
      // Only users with password that have been reset will pass this check

      static async authorize(req,res, next) {
          const bearerHeader = req.header("Authorization");
          if(typeof bearerHeader !== "undefined") {
            const bearer = bearerHeader.split();
            const bearerToken = bearer[1];
            req.token = bearerToken;
            const user = decodeToken(bearerToken);

            let authorizedUser = await Users.findByID(user._id)
            if(user.passwordResetRequired && !authorizedUser.passwordResetRequired) {
                return handleResponse(
                    res,
                    403,
                    "you requested to reset password or have already changed password Please re-login to continue"
                );
            }
            req.user = user;
            return next();
          }
          return handleResponse(res, 403, "Unauthorized access")
      };

        // Authorize only admin

        static async authorizeAdmin(req, res, next) {
            const bearerHeader = req.header("Authorization");
            if(typeof bearerHeader !== "undefined"){
                const bearer = bearerHeader.split(" ");
                const bearerToken = bearer[1];
      
                req.token = bearerToken;

                const user = decodeToken(bearerToken)
                let authorizedUser = await Users.findByID(user._id);
                if(user.role !== 'Admin') {
                    return handleResponse(
                        res,
                        403,
                        "You need to reset your password to continue"
                    );
                }

                req.user = user;
                return next();
            };
            return handleResponse(res, 403, "Unauthorized access, please login")
        };

        static CheckToken(req,res, next) {
            const decodedToken  = decodeToken(req.token);

            if(!decodeToken) {
                return handleResponse(res, 401, "Token expired, please re-login")
            }
            return next();
        };


        static authorizedRole(req,res, next) {
            const bearerHeader = req.headers.authorization;
            if(typeof bearerHeader !== "undefined"){
                const bearer = bearerHeader.split(" ");
                const bearer = bearerHeader[1];

                req.token = bearerToken;
                const user = decodeToken(bearerToken);
                if(rolesAcceptable(req.url,user.role)){
                    return next();
                }

                return handleResponse(res, 403, "invalid credentials")
            }

            return handleResponse(res, 403, "you are not authorized")

        };
}

export default AuthCheck;