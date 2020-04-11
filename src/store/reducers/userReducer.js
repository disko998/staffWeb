const initState = {
  authError2: null
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case "USER_SIGNUP_SUCCESS":
      console.log("sub user signup success");
      return {
        ...state,
        authError2: "sub user signup success"
      };

    case "USER_SIGNUP_ERROR":
      console.log("sub user signup error");
      return {
        ...state,
        authError2: action.err.message
      };

    default:
      return state;
  }
};

export default userReducer;
