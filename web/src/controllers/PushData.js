
export const pushFile = ( data, name) => {
    return new Promise((resolve, reject) => {
        fetch(`https://toeic-seb-firebase.herokuapp.com/database/${name}/add`, {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': "*",
                mode: 'no-cors'
            },
            body:data,
        }).then((data) => {
            resolve(data.json());
        })
    });
}