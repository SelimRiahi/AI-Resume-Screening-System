import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import RecruiterDashboard from "layouts/recruiter-dashboard/RecruiterDashboard";
import CandidateDashboard from "layouts/candidate-dashboard/CandidateDashboard"; // Import CandidateDashboard

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
  },
  {
    type: "collapse",
    name: "Recruiter Dashboard",
    key: "recruiter-dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/recruiter-dashboard",
    component: <RecruiterDashboard />,
  },
  {
    type: "collapse",
    name: "Candidate Dashboard",
    key: "candidate-dashboard",
    icon: <Icon fontSize="small">work</Icon>,
    route: "/candidate-dashboard",
    component: <CandidateDashboard />, // Add CandidateDashboard route
  },
];

export default routes;
