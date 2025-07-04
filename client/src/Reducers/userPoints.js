const initialpoints=parseInt(localStorage.getItem("userPoints")) || 0;
const userPoints=(state=initialpoints,action)=>{
    switch (action.type) {
        case 'ADD_POINTS':
            const newPoints = state + action.payload;
            localStorage.setItem("userPoints",newPoints);
            return newPoints;
        case 'RESET_POINTS':
            localStorage.setItem("userPoints",0);
            return 0;
        default:
            return state;
    }
};

export default userPoints;