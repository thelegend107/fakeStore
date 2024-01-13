function truncateString(string, productName=false) {
    let maxLength = 50;
    if (productName)
        maxLength = 25;
    
    let totalLength = 0;
    let stringArray = [];
    let stringSplit = string.split(' ');

    for (let i = 0; i < stringSplit.length; i++) {
        totalLength += stringSplit[i].length;
        if (totalLength > maxLength) {
            break;
        }
        else {
            stringArray.push(stringSplit[i]);
        }
    }

    let truncatedString = stringArray.join(' ').trim();
    if (truncatedString.lastIndexOf('-') > 0)
        truncatedString = truncatedString.slice(0, truncatedString.lastIndexOf('-')).trim();

    if (totalLength > maxLength)
        truncatedString += '...';

    return truncatedString;
}

export function productNameBrand(name) {
    return truncateString(name.split(' - ').shift(), true);
}

export function productDescription(name) {
    let nameArray = name.split(' - ');
    let description = [];

    for (let i = 1; i < nameArray.length; i++) {
        nameArray[i];
        description.push(nameArray[i]);
    }

    return truncateString(description.join(' - '));
}