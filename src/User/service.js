import bcrypt from "bcryptjs";
import { generateResetToken, generateToken, handleResponse} from "../helpers/util";
import Users from "../User/user_model";


class UserServices {

    static async loginUser(req,res){
        const {email,password} = req.body;

        try{
            let user = await Users.findOne({ email});
            if(!user){
                return handleResponse(res, 401, "Invalid Credentials");
            };

            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch) {
                return handleResponse(res, 401, "Invalid Credentials")
            };

            const token = generateResetToken({
                _id:user._id,
                role:user._doc.role,
                email:user._doc.email,
                passwordResetRequired: user._doc.passwordResetRequired,
            });

            return handleResponse(res, 200, "Successfully login", {
                ...user._doc,
                _id:user._id,
                password:undefined,
                token,
            })
        } catch (error) {
            return handelResponse(res, 500, "Some oocur occured")
        }
    };

    static async registerUser(req, res){
        try{
            const {
                full_name,
                title,
                description,
                email,
                staffId,
                role,
                profile_picture,
                phone_number,
                account_no,
                password,
                passwordResetToken,
                passwordResetExpires
            } = req.body

            const user = new Users({
                full_name,
                title,
                description,
                email,
                staffId,
                role,
                profile_picture,
                phone_number,
                account_no,
                password,
                passwordResetToken,
                passwordResetExpires,
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        let token = generateToken({...user._doc});
        res.status(200).json({
            user: {...user._doc, token}
        });

        }catch (error) {
            res.status(500).json({ error });
        }
    }

    static forgotPassword(req,res) {
        const {email} = req.body;
        try{
            let user = await Users.findOne({ email});

            if(!user) {
                return handleResponse(res, 401, "User with email address not found")
            }

            const token = generateToken({
                role:user._doc.role,
                email:user._doc.email,
                passwordResetRequired: user._doc.passwordResetRequired,
                tokenType:"reset",
            });
            await Users.findOneAndUpdate({email}, {
                $set: {
                    passwordResetToken:token,
                    passwordResetRequired:true,
                }, 
                new:true,
                upsert: true,
            });
              // front end URL

              const resetURL = `${req.protocol}://${req.get(
                "host"
            )}/verifyResetToken?token=${token}&userId=${user._id}`;


              // send password reset to user email
              
        return handleResponse(res, 200, "Password reset link sent your mail",{
            resetURL,
            password:undefined,
            token,
        });
        }catch (error) {
            return handleResponse(res, 500, "Some error occured");
        }
    }
}