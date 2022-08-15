export function getdomainurl(){
    var url = window.location.href;
    var arr = url.split("/");
    var result = arr[0] + "//" + arr[2];
    return result;
}

export function stringCmp(string1, string2){
    return string1.toLowerCase() == string2.toLowerCase()
}