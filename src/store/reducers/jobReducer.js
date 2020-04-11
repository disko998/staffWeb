const initState = {};

const jobReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_JOB_SUCCESS":
      console.log("create job success");
      return state;
    case "CREATE_JOB_ERROR":
      console.log("create job error");
      return state;
    default:
      return state;
  }
};

export default jobReducer;
