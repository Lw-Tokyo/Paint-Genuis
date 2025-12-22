import React, { useContext, useState } from "react";
import { FaEnvelope, FaUserTie, FaFileInvoice, FaClipboardList, FaShoppingCart, FaWallet } from "react-icons/fa";

// Mock UserContext for demonstration
const UserContext = React.createContext({ user: { name: "Alex Johnson" } });

// Mock DashboardLayout component
const DashboardLayout = ({ children }) => (
  <div style={{
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    padding: '2rem'
  }}>
    <style>{`
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}</style>
    {children}
  </div>
);

// Premium Dashboard Card Component
const PremiumCard = ({ title, value, icon, onClick, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '2rem',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: isHovered 
          ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(138, 99, 255, 0.4)'
          : '0 8px 32px rgba(0, 0, 0, 0.2)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        animation: `slideInUp 0.6s ease-out ${delay}s both`,
        flex: '1',
        minWidth: '250px'
      }}
    >
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
      {/* Animated background glow */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255, 105, 180, 0.2) 0%, transparent 70%)',
        animation: isHovered ? 'pulse 2s ease-in-out infinite' : 'none',
        pointerEvents: 'none'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          color: '#ff69b4',
          filter: 'drop-shadow(0 4px 8px rgba(255, 105, 180, 0.4))',
          animation: isHovered ? 'float 2s ease-in-out infinite' : 'none'
        }}>
          {icon}
        </div>
        
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'rgba(255, 255, 255, 0.9)',
          marginBottom: '0.5rem',
          letterSpacing: '0.5px'
        }}>
          {title}
        </h3>
        
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #ff69b4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {value}
        </div>
      </div>

      {/* Shine effect on hover */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
          animation: 'shine 0.8s ease-in-out',
          pointerEvents: 'none'
        }}>
          <style>{`
            @keyframes shine {
              0% { left: -100%; }
              100% { left: 100%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

function ClientDashboardPage() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          animation: 'slideInDown 0.6s ease-out'
        }}>
          <style>{`
            @keyframes slideInDown {
              from {
                opacity: 0;
                transform: translateY(-30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h2 style={{
                fontSize: '2rem',
                margin: '0 0 0.5rem 0',
                color: '#fff',
                fontWeight: '700',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
              }}>
                Welcome, {user?.name || "Client"} 👋
              </h2>
              <p style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0
              }}>
                Your premium dashboard awaits
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={() => window.location.href = "/budget"}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 1.5rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                <FaWallet />
                Budget
              </button>

              <button
                onClick={() => window.location.href = "/cart"}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem 1.5rem',
                  background: 'linear-gradient(135deg, #f093fb 0%, #ff69b4 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 105, 180, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 105, 180, 0.4)';
                }}
              >
                <FaShoppingCart />
                Cart
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#fff',
                  color: '#ff69b4',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  3
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '0.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          gap: '0.5rem',
          animation: 'slideInLeft 0.6s ease-out 0.2s both'
        }}>
          <style>{`
            @keyframes slideInLeft {
              from {
                opacity: 0;
                transform: translateX(-30px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}</style>
          
          <button
            onClick={() => setActiveTab("overview")}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: activeTab === "overview" 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'transparent',
              border: 'none',
              borderRadius: '16px',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === "overview" 
                ? '0 4px 15px rgba(102, 126, 234, 0.4)'
                : 'none',
              flex: 1
            }}
          >
            <FaClipboardList />
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab("estimates")}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 2rem',
              background: activeTab === "estimates" 
                ? 'linear-gradient(135deg, #f093fb 0%, #ff69b4 100%)'
                : 'transparent',
              border: 'none',
              borderRadius: '16px',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === "estimates" 
                ? '0 4px 15px rgba(255, 105, 180, 0.4)'
                : 'none',
              flex: 1
            }}
          >
            <FaFileInvoice />
            Saved Estimates
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" ? (
          <div style={{
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <PremiumCard
              title="Active Quotes"
              value="3"
              icon={<FaFileInvoice />}
              onClick={() => window.location.href = "/quotes"}
              delay={0.3}
            />
            <PremiumCard
              title="Messages"
              value="5"
              icon={<FaEnvelope />}
              onClick={() => window.location.href = "/messages"}
              delay={0.4}
            />
            <PremiumCard
              title="Hired Contractors"
              value="2"
              icon={<FaUserTie />}
              onClick={() => window.location.href = "/contractors"}
              delay={0.5}
            />
          </div>
        ) : (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            animation: 'fadeIn 0.4s ease-out',
            minHeight: '400px'
          }}>
            <style>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
            `}</style>
            
            <h3 style={{
              color: '#fff',
              fontSize: '1.5rem',
              marginTop: 0,
              marginBottom: '1rem'
            }}>
              Saved Estimates
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1rem'
            }}>
              Your saved estimates will appear here
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ClientDashboardPage;