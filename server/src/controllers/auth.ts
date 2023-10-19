import AuthHandler from "./../utils/authHandler";
import { ServerRequest, ControllerResponse } from "./../types";
import UserModel from "./../models/user";

class Controller {

    static async register(req: ServerRequest):Promise<ControllerResponse> {

        const data = {...req.body, ...{active:1}};

        const userModel = new UserModel(data);

        let error = undefined;

        const user = await userModel.register().then((result) => {
            return result
        }).catch((err) => {
            error = err;
            return null;
        });

        const output:any = {
            status: !!user,
            message: !!user ? 'Registration Successful' : 'Registration Failed',
            data: user?.data()
        }

        if(error) output.errors = error;

        return output;
    }

    static async login(req: ServerRequest):Promise<ControllerResponse> {

        const auth = new AuthHandler(req);

        const status = await auth.login(); 
        
        return {
            status: !!status,
            message: !!status ? 'Login Successful' : 'Login Failed',
            data: req.session?.user,
        }
    }

    static async logout(req: ServerRequest):Promise<ControllerResponse> {

        const sess_user = req.session.user;

        const userModel = new UserModel(sess_user || {});

        const status = await userModel.logout();
        
        return {
            status: !!status,
            message: !!status ? 'Logout Successful' : 'Logout Failed',
        }
    }

    static async remove(req: ServerRequest):Promise<ControllerResponse> {

        const sess_user = req.session.user;

        const userModel = new UserModel(sess_user || {});

        const status = await userModel.remove();
        
        return {
            status: !!status,
            message: !!status ? 'Logout Successful' : 'Logout Failed',
        }
    }
}

export default Controller;