const initialState = [
    {levelid: "L1", description: "Admin"},
    {levelid: "L2", description: "Ae"},
    {levelid: "L3", description: "Mitra Sampoerna"}
]

export default function levels(state=initialState, action={}){
    switch(action.type){
        default:
            return state;
    }
}