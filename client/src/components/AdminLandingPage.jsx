import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";
import ReadyToList from "./ReadyToList";
import ReadyToApprove from "./ReadyToApprove";
import AdminHome from "./AdminHome";


export default function AdminLandingPage(){

    return(
        <>
            <AdminNavbar></AdminNavbar>
            <AdminHome></AdminHome>
            <ReadyToApprove></ReadyToApprove>
            <Footer></Footer>
        </>
    );

}