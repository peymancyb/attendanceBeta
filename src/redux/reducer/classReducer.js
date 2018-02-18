export default function classReducer(state=null,action){
  switch (action.type) {
    case "CLASSID":
      return {...state,classID:action.payload}
      break;
    default:
    return state;
  }
}
