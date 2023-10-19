const ValidateRequired = (value: string | number | boolean | object):Promise<undefined | string> => {

    if(typeof value === 'object') return Promise.resolve(undefined);

    if(typeof value === 'string' && value.length === 0) return Promise.resolve('This field is required');

    if(typeof value === 'number') return Promise.resolve(undefined);

    if(typeof value === 'boolean') return Promise.resolve(undefined);

    if(typeof value === 'string' && value.length > 0) {
        const trimmedValue = value.trim();
        if(trimmedValue.length === 0) return Promise.resolve('This field is required');
    }

    return Promise.resolve(undefined);
}

export default ValidateRequired;