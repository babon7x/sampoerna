import { SET_MESSAGE } from "../types";

export const setMessage = (response, open, variant) => dispatch => {
    let message = '';
    if(response){
        if(response.rscode){
            if(typeof response.message === 'object'){
                message = `(${response.rscode}) ${response.message[Object.keys(response.message)[0]]}`
            }else{
                message = `(${response.rscode}) terdapat kesalahan`;
            }
        }else if(response.text){ //mostly for success message
            message = response.text;
        }else{
            message = '(500) Internal server error';
        }
    }

    dispatch({
        type: SET_MESSAGE,
        message: {
            variant,
            open,
            text: message
        }
    })
}