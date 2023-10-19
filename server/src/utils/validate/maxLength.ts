const ValidateMaxLength = (str: unknown, opt:string):Promise<undefined | string> => {

    if(typeof str !== 'string') return Promise.resolve('Field can not be empty');

    if(isNaN(parseInt(opt))) {
        return Promise.resolve('System error: Option must be a number in ValidateMinLength. Please contact support.');
    }

    const maxLength = parseInt(opt);

    if(str.length > maxLength) return Promise.resolve(`Value must be less than ${maxLength} characters long`);

    return Promise.resolve(undefined);
}

export default ValidateMaxLength;