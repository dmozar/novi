const ValidateAlpha = (str: string):Promise<undefined | string> => {

    if(typeof str !== 'string') return Promise.resolve('Field can not be empty');

    // valide alpha
    if(!str.match(/^[a-zA-Z]+$/)) return Promise.resolve('Must only contain letters');

    return Promise.resolve(undefined);
}

export default ValidateAlpha;