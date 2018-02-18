
export default function studentReducer(state={},action){
  switch (action.type) {
    case "INSERTSTUDENT":
       return [...state,action.payload];
      break;
    case "RESET":
      return [];
    default:
    return state;
  }
}
