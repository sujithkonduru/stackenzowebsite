
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import RND from "./RND";
import RNDProjectDetail from "./RNDProjectDetail";
import ResearchProjects from "./ResearchProjects";
import WebServices from "./webservices";
import Workshops from "./workshops";
import Robotics from "./robotics";
import DigitalMarketing from "./DigitalMarketing";
import Community from "./community";
import NewCommunity from "./NewCommunity";
import Contact from "./Contact";
import About from "./About";
import Terms from "./Terms";
import Privacy from "./Privacy";
import Career from "./Career";
import ResumeAdmin from "./ResumeAdmin";
import Programs from "./Programs";
import ProgramDetail from "./ProgramDetail";
import Services from "./Services";
import StackenzoPrograms from "./StackenzoPrograms";
import Portfolio from "./Portfolio";
import GalleryPage from "./GalleryPage";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <>
    <ScrollToTop />
   <Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/About" element={<About/>}/>
    <Route path="/Career" element={<Career/>}/>
    <Route path="/Robotics" element={<Robotics/>}/>
    <Route path="/WorkShops" element={<Workshops/>}/>
    <Route path="/R_AND_D" element={<RND/>}/>
    <Route path="/R_AND_D/:projectId" element={<RNDProjectDetail/>}/>
    <Route path="/research-projects" element={<ResearchProjects/>}/>
    <Route path="/WebServices" element={<WebServices/>}/>
    <Route path="/DigitalMarketing" element={<DigitalMarketing/>}/>
    <Route path="/Community" element={<Community/>}/>
    <Route path="/NewCommunity" element={<NewCommunity/>}/>
    <Route path="/Contact" element={<Contact/>}/>
    <Route path="/Programs" element={<Programs/>}/>
    <Route path="/Programs/:id" element={<ProgramDetail/>}/>
    <Route path="/Services/" element={<Services/>}/>
    <Route path="/StackenzoPrograms" element={<StackenzoPrograms/>}/>
    <Route path="/Portfolio" element={<Portfolio/>}/>
    <Route path="/Gallerypage" element={<GalleryPage/>}/>
    <Route path="/Terms" element={<Terms/>}/>
    <Route path="/Privacy" element={<Privacy/>}/>
    <Route path="/admin/resumes" element={<ResumeAdmin/>}/>
   </Routes>
   </>
  );
}

export default App;