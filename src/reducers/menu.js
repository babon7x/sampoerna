const initialState = [
    {
        id: 1,
        title: 'Pengguna',
        path: '/users',
        icon: 'person',
        collapse: false,
        submenu: [],
        subtitle: 'Data pengguna'
    },
    {
        id: 2,
        title: 'Bantuan',
        path: '/help',
        icon: 'home',
        collapse: false,
        submenu: [],
        subtitle: ''
    }
]

export default function menu(state=initialState, action={}){
    switch(action.type){
        default:
            return state;
    }
}