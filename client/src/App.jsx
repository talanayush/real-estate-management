import Footer from './components/Footer'
import Services from './components/Services'
import Transactions from './components/Transactions'
import MarketPlace from './components/MarketPlace'
import PropertyCard from './components/PropertyCard'
import AdminMarketPlace from './components/AdminMarketPlace'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './components/LandingPage'
import AdminLandingPage from './components/AdminLandingPage'
import Register from './components/Register'
import Welcome from './components/Welcome'
import Login from './components/Login'
import LoginAdmin from './components/LoginAdmin'
import DataFetcher from './components/test'
import DeployProperty from './components/DeployProperty'
import UserProfile from './components/UserProfile'
import AllTransactions from './components/AllTransactions'
function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <Routes>

            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<MarketPlace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/adminLogin" element={<LoginAdmin />} />
            <Route path="/admin/" element={<AdminLandingPage />} />
            <Route path="/admin/marketplace" element={<AdminMarketPlace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/deployProperty" element={<DeployProperty />} />
            <Route path="/allTransactions" element={<AllTransactions />} />
            
            <Route path="/test" element={<DataFetcher />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/property/:id" element={<PropertyCard />} />

          </Routes>
        </div>
        
        {/* Routing Section */}
      </div>
    </Router>
  );
}

export default App;