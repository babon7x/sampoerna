const initialState = [
    {"wilayah":"REGIONAL MEDAN","id":"20004"},
    {"wilayah":"REGIONAL PADANG","id":"25004"},
    {"wilayah":"REGIONAL PALEMBANG","id":"30004"},
    {"wilayah":"REGIONAL JAKARTA","id":"10004"},
    {"wilayah":"REGIONAL BANDUNG","id":"40004"},
    {"wilayah":"REGIONAL SEMARANG","id":"50004"},
    {"wilayah":"REGIONAL SURABAYA","id":"60004"},
    {"wilayah":"REGIONAL DENPASAR","id":"80004"},
    {"wilayah":"REGIONAL BANJARBARU","id":"70704"},
    {"wilayah":"REGIONAL MAKASAR","id":"90004"},
    {"wilayah":"REGIONAL JAYAPURA","id":"99004"}
];

export default function region(state=initialState, action={}){
    switch(action.type){
        default:
            return state;
    }
}