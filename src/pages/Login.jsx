import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    // Initial entrance animation
    gsap.fromTo(cardRef.current, 
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );
    
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" }
    );

    gsap.fromTo(formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.4, ease: "power2.out" }
    );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    if (formData.email === 'gallery@gmail.com' && formData.password === '12345678@G') {
      // Store auth state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      
      // Success animation
      gsap.to(cardRef.current, {
        scale: 1.02,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => onLogin()
      });
    } else {
      setError('Invalid credentials. Please try again.');
      // Shake animation for error
      gsap.to(cardRef.current, {
        x: [-10, 10, -10, 10, 0],
        duration: 0.5,
        ease: "power2.inOut"
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-github-primary flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div ref={titleRef} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-github-primary mb-2">Welcome to Gallery</h1>
          <p className="text-github-secondary">Sign in to access your image collection</p>
        </div>

        <div ref={cardRef} className="github-card p-8">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-github-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="gallery@gmail.com"
                required
                className="github-input"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-github-primary mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="github-input"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm gsap-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="github-btn primary w-full py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full loading-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-github">
            <div className="text-center">
              <p className="text-sm text-github-secondary mb-3">Demo Credentials</p>
              <div className="bg-github-tertiary rounded-lg p-3 text-xs text-github-secondary">
                <div><strong>Email:</strong> gallery@gmail.com</div>
                <div><strong>Password:</strong> 12345678@G</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-github-muted">
            Secure access to your premium gallery experience
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
