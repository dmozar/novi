const ValidateMinLength = (str: unknown, opt:string):Promise<undefined | string> => {

    if(typeof str !== 'string') return Promise.resolve('Field can not be empty');

    if(isNaN(parseInt(opt))) {
        return Promise.resolve('System error: Option must be a number in ValidateMinLength. Please contact support.');
    }

    const minLength = parseInt(opt);

    if(str.length < minLength) return Promise.resolve(`Value must be at least ${minLength} characters long`);

    return Promise.resolve(undefined);
}

export default ValidateMinLength;