import './../types/string';
import crypto from 'crypto';



String.prototype.capitalizeFirstLetter = function() {
    const arr = this.split(' ');
    const n = arr.map((word:string) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return n.join(' ');
}


String.prototype.generateHash = async function() {
    const str = this as string;
    const salt = process.env.SALT as string;
    return crypto.pbkdf2Sync(str, salt, 10000, 512, 'sha512').toString('hex');
}