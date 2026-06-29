import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const Login = lazy(() => import("./Pages/Login"));
const CreateMeeting = lazy(() => import("./CreateMeeting"));
const ConductMeeting = lazy(() => import("./ConductMeeting"));
const BoardResolutions = lazy(() => import("./BoardResolutions"));
const CompanyManagement = lazy(() => import("./Company"));
const MemberProfile = lazy(() => import("./MemberProfile"));
const PrintReview = lazy(() => import("./PrintReview"));
const SignDocuments = lazy(() => import("./SignDocuments"));
const Tasks = lazy(() => import("./Tasks"));
const ManageResolutions = lazy(() => import("./ManageResolutions"));
const ViewMeeting = lazy(() => import("./ViewMeeting"));
const Notification = lazy(() => import("./Notification"));
const BoardMeeting = lazy(() => import("./BoardMeeting"));
    console.log("========hfjfjfjfgjfgjnfgmfgjmfgkmgfmkgcjtdyjn,/mblkhyrewa5tydjg,v.nhkuyirtfvjghtescvm b")
export default [
  
        <Route path="/" exact component={Login} />,
        // <Redirect exact from="/" to="/create" />,
        // <Route
            
        //     path="/create"
        //     exact
        //     render={() => <CreateMeeting editMeeting={props.meetingToEdit} onEditSave={props.onEditSave} />}
        // />,
        // <Route
             
        //     path="/conduct"
        //     exact
        //     render={() => <ConductMeeting onEditMeeting={props.onEditMeeting} />}
        // />,
        <Route path="/circular" exact component={BoardResolutions} />,
        <Route path="/companies" exact component={CompanyManagement} />,
        <Route path="/member" exact component={MemberProfile} />,
        <Route path="/print" exact component={PrintReview} />,
        <Route path="/sign" exact component={SignDocuments} />,
        <Route path="/tasks" exact component={Tasks} />,
        <Route path="/resolutions" exact component={ManageResolutions} />,
        <Route path="/meeting" exact component={ViewMeeting} />,
        <Route path="/notification" exact component={Notification} />,
        <Route path="/book" exact component={BoardMeeting} />,
        //   <Redirect key="catch" to="/create" />,
    ];
 