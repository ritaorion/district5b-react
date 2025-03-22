import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Acronyms from './pages/Acronyms';
import AGSR from './pages/AGSR';
import GSR from './pages/GSR';
import Events from './pages/Events';
import Map from './pages/Map';
import Meetings from './pages/Meetings';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import ResourceDownloader from './components/ResourceDownloader';
import Dashboard from './pages/auth/Dashboard';
import Users from './pages/auth/Users';
import ContactForms from './pages/auth/ContactForms';
import AdminEvents from './pages/auth/Events';
import Unauthorized from './pages/errors/Unauthorized';
import NotFound from './pages/errors/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="acronyms" element={<Acronyms />} />
                    <Route path="about" element={<About />} />
                    <Route path="map" element={<Map />} />
                    <Route path="agsr" element={<AGSR />} />
                    <Route path="gsr" element={<GSR />} />
                    <Route path="meetings" element={<Meetings />} />
                    <Route path="events" element={<Events />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="resources" element={<Resources />} />
                    <Route path="resources/:resourceName" element={<ResourceDownloader />} />

                    <Route
                        path="login"
                        element={
                            isAuthenticated ?
                                <Navigate to="/auth/dashboard" replace /> :
                                <Login />
                        }
                    />

                    <Route path="auth">
                        <Route
                            path="dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="users"
                            element={
                                <ProtectedRoute>
                                    <Users />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={'contact-forms'}
                            element={
                                <ProtectedRoute>
                                    <ContactForms />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path={'events'}
                            element={
                                <ProtectedRoute>
                                    <AdminEvents />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    <Route path="/403" element={<Unauthorized />} />
                    <Route path="/404" element={<NotFound />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;