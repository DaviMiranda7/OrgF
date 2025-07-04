            />

            {/* Main content */}
            <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
              !isMobile && sidebarOpen ? 'lg:ml-64' : !isMobile && !sidebarOpen ? 'lg:ml-16' : ''
            }`}>
              {/* Header */}
              <Header 
                user={user}
                onLogout={handleLogout}
                onToggleSidebar={toggleSidebar}
              />

              {/* Page content */}
              <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                <Routes>
                  <Route 
                    path="/" 
                    element={<Dashboard userId={user.id} />} 
                  />