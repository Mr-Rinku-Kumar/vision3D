import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Viewer() {
  const { logout, token } = useAuth();
  const [modelUrl, setModelUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const controlsRef = useRef();

  useEffect(() => {
    fetchUserObjects();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchUserObjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/objects/my-objects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setObjects(response.data);
      if (response.data.length > 0 && !modelUrl) {
        setModelUrl(response.data[0].fileUrl);
      }
    } catch (error) {
      console.error('Error fetching objects:', error);
      showNotification('Failed to load objects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.glb')) {
      showNotification('Please upload a .glb file', 'error');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      showNotification('File too large (max 50MB)', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('model', file);

    setUploading(true);
    try {
      const response = await axios.post(`${API_URL}/objects/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setModelUrl(response.data.object.fileUrl);
      await fetchUserObjects();
      showNotification('Upload successful!', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showNotification(error.response?.data?.error || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDeleteObject = async (objectId, fileName) => {
    if (!confirm(`Delete "${fileName}"? This action cannot be undone.`)) return;
    
    try {
      await axios.delete(`${API_URL}/objects/${objectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchUserObjects();
      if (modelUrl === objects.find(o => o._id === objectId)?.fileUrl) {
        setModelUrl(null);
      }
      showNotification('Deleted successfully', 'success');
    } catch (error) {
      console.error('Delete error:', error);
      showNotification('Delete failed', 'error');
    }
  };

  const saveCameraState = async () => {
    if (!controlsRef.current || !modelUrl) {
      showNotification('No model loaded', 'error');
      return;
    }
    
    const position = controlsRef.current.object.position;
    const target = controlsRef.current.target;
    
    const currentObject = objects.find(obj => obj.fileUrl === modelUrl);
    if (!currentObject) {
      showNotification('Object not found', 'error');
      return;
    }

    try {
      await axios.put(`${API_URL}/objects/${currentObject._id}/camera-state`,
        { 
          position: { x: position.x, y: position.y, z: position.z },
          target: { x: target.x, y: target.y, z: target.z }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification('Camera state saved!', 'success');
      await fetchUserObjects(); // Refresh to show saved badge
    } catch (error) {
      console.error('Error saving camera state:', error);
      showNotification('Failed to save camera state', 'error');
    }
  };

  return (
    <div style={styles.container}>
      {notification && (
        <div style={{...styles.notification, ...styles[notification.type]}}>
          {notification.message}
        </div>
      )}
      
      <div style={styles.sidebar}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.logo}>🎨 3D Viewer</h2>
            <p style={styles.subtitle}>View and manage your 3D models</p>
          </div>
          <button onClick={logout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
        
        <div style={styles.uploadSection}>
          <label style={styles.uploadLabel}>
            📁 Upload .glb File
            <input
              type="file"
              accept=".glb"
              onChange={handleFileUpload}
              disabled={uploading}
              style={styles.hiddenFileInput}
            />
          </label>
          {uploading && (
            <div style={styles.uploadingText}>
              <span>Uploading to Cloudinary...</span>
            </div>
          )}
          <p style={styles.uploadHint}>Supports .glb files up to 50MB</p>
        </div>

        <div style={styles.objectsList}>
          <h3 style={styles.sectionTitle}>
            📦 Your Models ({objects.length})
          </h3>
          {loading ? (
            <div style={styles.loadingState}>Loading...</div>
          ) : objects.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No models yet</p>
              <p style={styles.emptyHint}>Upload your first .glb file to get started</p>
            </div>
          ) : (
            <div style={styles.objectsGrid}>
              {objects.map(obj => (
                <div key={obj._id} style={styles.objectCard}>
                  <div style={styles.objectInfo}>
                    <span style={styles.objectName}>
                      {obj.fileName.length > 30 
                        ? obj.fileName.substring(0, 27) + '...' 
                        : obj.fileName}
                    </span>
                    {obj.cameraState?.position && (
                      <span style={styles.savedBadge}>💾 Saved</span>
                    )}
                  </div>
                  <div style={styles.objectActions}>
                    <button 
                      onClick={() => setModelUrl(obj.fileUrl)} 
                      style={styles.loadButton}
                      title="Load model"
                    >
                      👁️
                    </button>
                    <button 
                      onClick={() => handleDeleteObject(obj._id, obj.fileName)} 
                      style={styles.deleteButton}
                      title="Delete model"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={saveCameraState} 
          style={styles.saveButton}
          disabled={!modelUrl}
        >
          💾 Save Camera State
        </button>
      </div>

      <div style={styles.viewer}>
        {modelUrl ? (
          <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <directionalLight position={[-5, 5, 0]} intensity={0.5} />
            <pointLight position={[0, 5, 0]} intensity={0.3} />
            <Model url={modelUrl} />
            <OrbitControls
              ref={controlsRef}
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              zoomSpeed={1.2}
              panSpeed={0.8}
              rotateSpeed={1.0}
            />
          </Canvas>
        ) : (
          <div style={styles.placeholder}>
            <div>
              <p style={styles.placeholderIcon}>🎨</p>
              <p style={styles.placeholderText}>No model loaded</p>
              <p style={styles.placeholderSubtext}>
                Upload a .glb file from the sidebar to view your 3D model
              </p>
              <p style={styles.placeholderHint}>
                Supports rotation, zoom, and pan
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
  },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    zIndex: 1000,
    animation: 'slideIn 0.3s ease',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  success: {
    background: '#4ecdc4',
    color: '#fff',
  },
  error: {
    background: '#e94560',
    color: '#fff',
  },
  sidebar: {
    width: '320px',
    background: '#1a1a2e',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '15px',
    borderBottom: '2px solid #16213e',
  },
  logo: {
    fontSize: '20px',
    marginBottom: '5px',
  },
  subtitle: {
    fontSize: '12px',
    color: '#888',
  },
  logoutButton: {
    padding: '8px 16px',
    background: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  uploadSection: {
    padding: '20px',
    background: '#16213e',
    borderRadius: '12px',
    textAlign: 'center',
  },
  uploadLabel: {
    display: 'inline-block',
    padding: '12px 24px',
    background: '#0f3460',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  hiddenFileInput: {
    display: 'none',
  },
  uploadingText: {
    marginTop: '10px',
    fontSize: '12px',
    color: '#4ecdc4',
  },
  uploadHint: {
    fontSize: '11px',
    color: '#888',
    marginTop: '10px',
  },
  objectsList: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: '16px',
    marginBottom: '15px',
  },
  objectsGrid: {
    overflowY: 'auto',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  objectCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: '#16213e',
    borderRadius: '8px',
    transition: 'transform 0.2s',
  },
  objectInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    flex: 1,
  },
  objectName: {
    fontSize: '13px',
    fontWeight: '500',
  },
  savedBadge: {
    fontSize: '10px',
    color: '#4ecdc4',
    background: 'rgba(78,205,196,0.2)',
    padding: '2px 6px',
    borderRadius: '4px',
    display: 'inline-block',
    width: 'fit-content',
  },
  objectActions: {
    display: 'flex',
    gap: '8px',
  },
  loadButton: {
    padding: '8px 12px',
    background: '#4ecdc4',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  deleteButton: {
    padding: '8px 12px',
    background: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  saveButton: {
    padding: '12px',
    background: '#4ecdc4',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: 'auto',
  },
  viewer: {
    flex: 1,
    background: '#0f0f1a',
    position: 'relative',
  },
  placeholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    color: '#666',
  },
  placeholderIcon: {
    fontSize: '64px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  placeholderText: {
    fontSize: '20px',
    textAlign: 'center',
    marginBottom: '10px',
  },
  placeholderSubtext: {
    fontSize: '14px',
    textAlign: 'center',
    color: '#888',
    marginBottom: '10px',
  },
  placeholderHint: {
    fontSize: '12px',
    textAlign: 'center',
    color: '#666',
  },
  loadingState: {
    textAlign: 'center',
    padding: '20px',
    color: '#888',
  },
  emptyState: {
    textAlign: 'center',
    padding: '30px 20px',
    color: '#888',
  },
  emptyHint: {
    fontSize: '12px',
    marginTop: '8px',
  },
};

export default Viewer;