import { useState } from 'react'
import LoginPage from './components/Login.jsx'
import HomePage from './components/HomePage.jsx'
import RegisterOrganizationPage from './components/RegisterOrganization.jsx'
import RegisterUserPage from './components/RegisterUser.jsx'
import AboutPage from './components/About.jsx'
import DashboardPage from './components/Dashboard.jsx'
import AdminPage from './components/Admin.jsx'
import HeadofdepartmentPage from './components/Headofdepartment.jsx'
import Financials from './components/Financials.jsx'
import { BrowserRouter , Routes , Route } from 'react-router-dom'

function App() {
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/registerorg' element={<RegisterOrganizationPage />} />
          <Route path='/register' element={<RegisterUserPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/admin-panel' element={<AdminPage />} />
          <Route path='/headofdepartmentpage' element={<HeadofdepartmentPage />} />
          <Route path="/departments/:deptId/financials" element={<Financials />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
