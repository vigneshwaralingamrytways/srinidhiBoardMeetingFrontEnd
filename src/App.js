// import logo from './logo.svg';
// import './App.css';
// import MeetingPlatform from "./MeetingPlatform";
// import LoginPage from "./LoginPage";

// function App() {
//   return (
//   //  <MeetingPlatform/>
//   <LoginPage/>
//   );
// }

// export default App;

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import CreateMeetingPage from "./pages/CreateMeetingPage";
// import ConductMeetingPage from "./pages/ConductMeetingPage";
// import VotingPage from "./pages/VotingPage";
// import BoardResolutionPage from "./pages/BoardResolutionPage";
// import MOMPage from "./pages/MOMPage";

// import "./global.css";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<CreateMeetingPage />} />
//         <Route path="/conduct" element={<ConductMeetingPage />} />
//         <Route path="/voting" element={<VotingPage />} />
//         <Route path="/resolution" element={<BoardResolutionPage />} />
//         <Route path="/mom" element={<MOMPage />} />
//       </Routes>
//     </Router>
//   );
// }
import React, { useContext, useState } from "react";
import "./App.css";
import Navigation from "./Navigation";
import CreateMeeting from "./CreateMeeting";
import ConductMeeting from "./ConductMeeting";
import BoardResolutions from "./BoardResolutions";
import MinutesOfMeeting from "./MinutesOfMeeting";
import Voting from "./Voting";
import SignDocuments from "./SignDocuments";
import CompanyManagement from "./Company";
import MemberProfile from "./MemberProfile";
import PrintReview from "./PrintReview";
import Tasks from "./Tasks";
// import Resolutions from './Resolutions';
import ViewMeeting from './ViewMeeting';
import ManageResolutions from "./ManageResolutions";
import Notification from './Notification';
import BoardMeeting from "./BoardMeeting";
 
import Login from "./Pages/Login";
import { Provider } from "use-http";
import AllRoutes from "./Routes";
import Protected from"./Protected"
import { Route, Switch } from "react-router-dom/cjs/react-router-dom.min";
import AuthContext from "./Forms/Store/auth-context";
export default function App() {
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const isLoggedIn = authCtx.isLoggedIn;
  console.log("isLogged====>",authCtx, isLoggedIn)
  const [page, setPage] = useState("create");
  const [meetingToEdit, setMeetingToEdit] = useState(null);
  const options = {
    interceptors: {
      request: async ({ options }) => {
        if (!options.headers) {
          options.headers = {};
        }

        if (token) {
          options.headers.Authorization = `Bearer ${token}`;
        }

        return options;
      },
    },
  };
  const handleEditMeeting = (meeting) => {
    setMeetingToEdit(meeting);
    setPage("create");
  };

  const handleEditSave = (updatedMeeting) => {
    setMeetingToEdit(null);
    setPage("conduct");
  };

  const handleSetPage = (newPage) => {
    setMeetingToEdit(null);
    setPage(newPage);
  };
const routeProps = {
    meetingToEdit,
    onEditSave: handleEditSave,
    onEditMeeting: handleEditMeeting
};
  const pages = {
    create: (
      <CreateMeeting
        editMeeting={meetingToEdit}
        onEditSave={handleEditSave}
      />
    ),
    conduct: (
      <ConductMeeting
        onEditMeeting={handleEditMeeting}
      />
    ),
    circular: <BoardResolutions />,
    companies: <CompanyManagement />,
    member: <MemberProfile />,
    print: <PrintReview />,
    sign: <SignDocuments />,
    tasks: <Tasks />,
    resolutions: <ManageResolutions />,
    meeting: <ViewMeeting />,
    notification: <Notification />,
    bookMeetingRoom: <BoardMeeting />
  };

  // return (
  //   <div className="app-root">
  //     <Navigation page={page} setPage={handleSetPage} />
  //     <main className="app-content">{pages[page]}</main>
  //   </div>
  // );
  // if (!isLoggedIn) {
  //   return <Login />;
  // }
  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  );
//  return (
//        <Switch>
//       <Route path='/' exact component={Login}/>
//       <Provider options={options}>
      
       
//       <>
//       <Protected isSignedIn={isLoggedIn}>
//        <React.Suspense fallback={loading}>
//         {AllRoutes}
//         </React.Suspense>
//         </Protected>
//         </>
        
//         </Provider>
//       </Switch>
//   );
return (
    <>
      {/* <ModalBoots   show={showAlert} onHide={() => AlertHandler("", "")} style={{ zIndex: 5000 }}>
       
        <ModalBoots.Header className={classes.modalhd} >
          <ModalBoots.Title >Alert Message</ModalBoots.Title>
        </ModalBoots.Header>
        <div style={{backgroundImage: `url(${modalimg})`,backgroundSize: "cover", borderRadius:'inherit'}}>
        <ModalBoots.Body className={classes.modalbdy}>
          <p style={{color:`${alertVariant=="success" ? "Green" : "Red"}`}}> {alertMessage}</p></ModalBoots.Body>
        <ModalBoots.Footer
       >
          <Button variant="secondary" onClick={() => AlertHandler("", "")}>
            Close
          </Button>
        </ModalBoots.Footer>
        </div>

      </ModalBoots> */}
     <Switch>
      <Route path='/' exact component={Login}/>
      <Provider options={options}>
      {/* <Header> */}
       {/* {showModal &&
            modalStack.map((modal, index) => (
              <Modal width={modal.modalWidth} left={modal.modalLeft} onClose={()=>dispatch(modalActions.hideModalHandler())} 
              index={index}
        backdropOnClose={modal.backdropOnClose} >
          {modal.selectedForm}
        </Modal>
        ))} */}
      <>
      <Protected isSignedIn={isLoggedIn}>
       <React.Suspense fallback={loading}>
        {AllRoutes}
        </React.Suspense>
        </Protected>
        </>
        {/* </Header> */}
        </Provider>
      </Switch> 
    </>
  );
}
