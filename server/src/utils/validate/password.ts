const ValidatePassword = (password: string):Promise<undefined | string> => {

    if(typeof password !== 'string') return Promise.resolve('Field can not be empty');

    if(password.length < 8) return Promise.resolve('Password must be at least 8 characters long');

    if(password.length > 50) return Promise.resolve('Password must be less than 50 characters long');

    if(!password.match(/[a-z]/)) return Promise.resolve('Password must contain at least one lowercase letter');

    if(!password.match(/[A-Z]/)) return Promise.resolve('Password must contain at least one uppercase letter');

    if(!password.match(/[0-9]/)) return Promise.resolve('Password must contain at least one number');

    if(!password.match(/[^a-zA-Z0-9]/)) return Promise.resolve('Password must contain at least one special character');

    return Promise.resolve(undefined);
}

export default ValidatePassword;