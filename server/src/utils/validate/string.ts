const ValidateString = (str: string):Promise<undefined | string> => {

    if(typeof str !== 'string') return Promise.resolve('Field can not be empty');

    if(str.length < 1) return Promise.resolve('Must be at least 1 character long');

    if(str.includes('  ')) return Promise.resolve('Must not contain more than one space in a row');

    // string must not contain any of these characters
    if(str.match(/[<>]/)) return Promise.resolve('Must not contain < or >');
    if(str.match(/[{}]/)) return Promise.resolve('Must not contain { or }');
    if(str.match(/[\[\]]/)) return Promise.resolve('Must not contain [ or ]');
    if(str.match(/[()]/)) return Promise.resolve('Must not contain ( or )');
    if(str.match(/[\\]/)) return Promise.resolve('Must not contain \\');

    return Promise.resolve(undefined);
}

export default ValidateString;