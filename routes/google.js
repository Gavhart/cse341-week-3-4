app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
  }));
  
  app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });
  
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });