import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import api from '../../services/api';
import { Room } from '../../types';
import NewRoomModal from './NewRoomModal';

const TYPE_LABELS: Record<string, string> = {
  bedroom: 'Bedroom',
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
};

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/rooms').then((res) => setRooms(res.data.rooms));
  }, []);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const createRoom = async (data: {
    name: string;
    room_type: string;
    width: number;
    length: number;
    wall_color: string;
  }) => {
    try {
      const res = await api.post('/rooms', data);
      setRooms([res.data.room, ...rooms]);
      setShowModal(false);
      showSuccess('Room created successfully');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create room');
    }
  };

  const deleteRoom = async (id: number) => {
    try {
      await api.delete(`/rooms/${id}`);
      setRooms(rooms.filter((r) => r.id !== id));
      showSuccess('Room deleted successfully');
    } catch {
      setError('Failed to delete room');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Rooms</h1>
        <div>
          <span>{user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {error && <div className="message-bar error">{error}</div>}
      {success && <div className="message-bar success">{success}</div>}

      <div className="create-room">
        <button onClick={() => setShowModal(true)}>New Room</button>
      </div>

      <div className="room-list">
        {rooms.map((room) => (
          <div key={room.id} className="room-card">
            <div
              className="room-card-color"
              style={{ backgroundColor: room.wall_color }}
            />
            <h3>{room.name}</h3>
            <p className="room-card-meta">
              {TYPE_LABELS[room.room_type] || room.room_type} &middot;{' '}
              {room.width}&times;{room.length}
            </p>
            <div className="room-card-actions">
              <button onClick={() => navigate(`/editor/${room.id}`)}>
                Open
              </button>
              <button className="danger" onClick={() => deleteRoom(room.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {rooms.length === 0 && (
          <p className="empty">No rooms yet. Create one!</p>
        )}
      </div>

      {showModal && (
        <NewRoomModal
          onClose={() => setShowModal(false)}
          onCreate={createRoom}
        />
      )}
    </div>
  );
}