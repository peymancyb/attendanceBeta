
export default function studentReducer(state=[],action){
  switch (action.type) {
    case "INSERTSTUDENT":
       return {...state,student:action.payload};
      break;
    default:
    return state;
  }
}
