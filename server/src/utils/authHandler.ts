import UserModel from "../models/user";
import { ServerRequest, UserDocument } from "../types";
import jwt from 'jsonwebtoken';



class AuthHandler {

    private req: ServerRequest;

    constructor(req: ServerRequest) {
        this.req = req;
    }

    /**
     * Login user
     * 
     * @description Login user and set session. Valiadate email and password, match with database mongodb model.
     * @access public
     * @param Email 
     * @param password 
     */
    public async login(): Promise<boolean> {
        
        const model = new UserModel({});

        model.email = this.req.body.email as string || '';
        
        model.password = this.req.body.password || '';

        const user = await model.login();

        if(user){

            if(!this.req.session){
                this.req.session = {} as any;
            }

            this.req.session.user = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: user.token,
                active: user.active,
                deleted: user.deleted,
                dateCreated: user.dateCreated,
                dateUpdated: user.dateUpdated,
            };

            // generate jwt token
            const { sign } = jwt;

            try {
                const token:string = sign({_id: user._id, email: user.email}, process.env.SECRET_KEY as string, {expiresIn: process.env.SESSION_DURATION ?? '1d'})

                user.token = token;

                await user.saveToken();

                this.req.session.user.token = token;

                return true;
            } catch (_err:any) {

                return false;
            }
        }

        return false;
    }


    // remove token from user
    public async logout(id:number, token:string): Promise<boolean> {
        const model = new UserModel({id, token});
        return await model.logout();
    }


    public async authenticate(): Promise<boolean> {

        // use jwt web token to validate token
        // get from header barer token

        const token:string = this.req.headers.authorization?.split(' ')[1] || '';

        if(!token) return Promise.resolve(false);

        return new Promise<boolean>( ( resolve ) => {
            jwt.verify(token, process.env.SECRET_KEY as string, (err, decoded) => {

                if(err) {
                    return resolve(false);
                }

                if(!this.req.session) this.req.session = {} as any;

                this.req.session.user = decoded as UserDocument;
                
                const userModel = new UserModel(decoded as UserDocument);

                userModel.verifyToken().then((_token:string) => {

                    const vStatus = ((_token !== '' && token !== '' && _token !== null && token !== null)  && (_token === token));

                    if(!vStatus) {
                        
                        this.req.session.user = null;
                        
                    }

                    resolve( vStatus );

                }).catch((err) => {
                    console.log('err', err);
                    resolve(false);
                });

            })
        });
        



    }
}

export default AuthHandler;