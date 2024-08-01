import React, {useEffect,useReducer} from 'react';

const ActionTypes = {
  SET_USER_DATA: 'SET_USER_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CURRENT_PAGE: 'SET_CURRENT_PAGE',
  SET_COUNTRY: 'SET_COUNTRY',
  SET_GENDER: 'SET_GENDER',
};


const initialState = {
  userData: [],
  loading: false,
  error: { status: false, msg: "" },
  currentPage: 1,
  country: "",
  gender: "",
};


const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER_DATA:
      return { ...state, userData: action.payload };
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    case ActionTypes.SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    case ActionTypes.SET_COUNTRY:
      return { ...state, country: action.payload, currentPage: 1 };
    case ActionTypes.SET_GENDER:
      return { ...state, gender: action.payload, currentPage: 1 };
    default:
      return state;
  }
};

const Index = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { userData, loading, error, currentPage, country, gender } = state;
  const itemsPerPage = 10;


  const fetchUserData = async () => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_ERROR, payload: { status: false, msg: "" } });

    try {
      const response = await fetch("https://dummyjson.com/users");
      if (!response.ok) throw new Error("Data not found");

      const data = await response.json();
      dispatch({ type: ActionTypes.SET_USER_DATA, payload: data.users });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: { status: true, msg: error.message || "Something went wrong, try again!" } });
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  
  useEffect(() => {
    fetchUserData();
  }, []); 


  const handlePageChange = (newPage) => {
    dispatch({ type: ActionTypes.SET_CURRENT_PAGE, payload: newPage });
  };


  const handleCountryChange = (e) => {
    dispatch({ type: ActionTypes.SET_COUNTRY, payload: e.target.value });
  };

  const handleGenderChange = (e) => {
    dispatch({ type: ActionTypes.SET_GENDER, payload: e.target.value });
  };


  const filteredUserData = userData.filter(user => {
    return (
      (!country || user.address.country === country) &&
      (!gender || user.gender === gender)
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedUserData = filteredUserData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredUserData.length / itemsPerPage);

  
  if (loading) return <h1>Loading...</h1>;
  if (error.status) return <h3>{error.msg}</h3>;

 
  return (
    <center>
      <div className='container'>
        <h1>Employees Data</h1>
        <div className='filters'>
          <label>
            <select value={country} onChange={handleCountryChange}>
              <option value="">Country</option>
              <option value="United States">United States</option>
              <option value="India">India</option>
           
            </select>
          </label>
          <label>
            <select value={gender} onChange={handleGenderChange}>
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="transgender">Transgender</option>
            
            </select>
          </label>
        </div>
        <table className='user-table'>
          <thead>
            <tr>
              <th>id</th>
              <th>Image</th>
              <th>Full Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Location</th>
              <th>Designation</th>
            </tr>
          </thead>
          <tbody>
            {selectedUserData.map(user => (
              <tr key={user.id}>
                <td> <center>{user.id}</center> </td> 
                <td> <center><img src={user.image} alt={`${user.firstName} ${user.lastName}`} width="50" /> </center> </td>
                <td> <center>{`${user.firstName} ${user.lastName}`} </center></td>
                <td> <center>{user.gender} </center> </td>
                <td> <center>{user.age} </center> </td>
                <td> <center>{`${user.address.state}, ${user.address.country}`} </center> </td>
                <td> <center>{user.company.title} </center> </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pagination'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              disabled={index + 1 === currentPage}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </center>
  );
};

export default Index;