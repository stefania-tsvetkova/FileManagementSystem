export class RequestService {
    get(url, data) {
        return fetch(
            `${url}?${data}`, 
            {
                method: 'GET',
            })
            .then(response => response.text());
    }
    
    post(url, data) {
        return fetch(
            url, 
            {
                method: 'POST',
                body: data
            })
            .then(response => response.text());
    }
}