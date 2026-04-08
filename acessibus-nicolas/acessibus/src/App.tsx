import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FooterNav from './components/FooterNav';
import HomePage from './pages/HomePage';
import RecentsPage from './pages/RecentsPage';
import FavoritesPage from './pages/FavoritesPage';
import SignInPage from './pages/SignInPage'; // Renamed from LoginPage
import RegisterPage from './pages/RegisterPage'; // New Register page
import ProfilePage from './pages/ProfilePage';
import { ActiveTab, BusLine, User } from './types';
import { MOCK_BUS_LINES, MOCK_USER } from './constants';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Home);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [busLines, setBusLines] = useState<BusLine[]>(MOCK_BUS_LINES);

  // Load login state and user from local storage (or mock for now)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
    // For bus lines, could also load from local storage
    setBusLines(MOCK_BUS_LINES.map(line => ({ ...line, isFavorite: localStorage.getItem(`favorite-${line.id}`) === 'true' })));
  }, []);

  const handleLoginSuccess = (email: string) => {
    const loggedInUser: User = {
      ...MOCK_USER, // Use mock user data
      email: email, // Override with actual login email
    };
    setCurrentUser(loggedInUser);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
    setActiveTab(ActiveTab.Home); // Redirect to home after login
  };

  const handleRegisterSuccess = (name: string, email: string) => {
    const registeredUser: User = {
      id: `user-${Date.now()}`, // Simple unique ID
      name: name,
      email: email,
      profilePicUrl: `https://picsum.photos/60/60?random=${Date.now()}`, // Mock profile pic
    };
    setCurrentUser(registeredUser);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(registeredUser));
    setActiveTab(ActiveTab.Home); // Redirect to home after registration
  };

  const handleLogout = () => {
    setCurrentUser(undefined);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
    setActiveTab(ActiveTab.Home); // Redirect to home after logout
  };

  const handleProfileClick = () => {
    setActiveTab(isLoggedIn ? ActiveTab.Profile : ActiveTab.Login);
  };

  const handleToggleFavorite = (id: string) => {
    setBusLines((prevLines) =>
      prevLines.map((line) => {
        if (line.id === id) {
          const newFavoriteStatus = !line.isFavorite;
          if (newFavoriteStatus) {
            localStorage.setItem(`favorite-${line.id}`, 'true');
          } else {
            localStorage.removeItem(`favorite-${line.id}`);
          }
          return { ...line, isFavorite: newFavoriteStatus };
        }
        return line;
      }),
    );
  };

  const favoriteBusLines = busLines.filter((line) => line.isFavorite);
  const recentBusLines = busLines; // All mock lines are considered recent for this example

  const renderPage = () => {
    switch (activeTab) {
      case ActiveTab.Home:
        return <HomePage />;
      case ActiveTab.Recents:
        return <RecentsPage recentBusLines={recentBusLines} onToggleFavorite={handleToggleFavorite} />;
      case ActiveTab.Favorites:
        return (
          <FavoritesPage
            favoriteBusLines={favoriteBusLines}
            onToggleFavorite={handleToggleFavorite}
            onRegisterClick={() => setActiveTab(ActiveTab.Register)} // Navigate to Register page
            isLoggedIn={isLoggedIn}
          />
        );
      case ActiveTab.Login:
        return <SignInPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setActiveTab(ActiveTab.Register)} />;
      case ActiveTab.Register:
        return <RegisterPage onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={() => setActiveTab(ActiveTab.Login)} />;
      case ActiveTab.Profile:
        return currentUser ? <ProfilePage currentUser={currentUser} onLogout={handleLogout} /> : <SignInPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setActiveTab(ActiveTab.Register)} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans">
      <Header onProfileClick={handleProfileClick} currentUser={currentUser} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
      <FooterNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default App;