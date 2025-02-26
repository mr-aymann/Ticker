export const formValidation = (data) =>{
    console.log("data", data)
    let isValid = true;
    let errors= {}

    for (const key in data){
        if(!data[key]){
            errors[key] = 'This field is required'
            isValid = false
        }else{
            errors[key] = ''
        }
    }

    return {
        isValid, errors
    }
}