import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Room, FurniturePlacement } from '../../types';
import RoomScene from '../Scene/RoomScene';
import CatalogPanel from './CatalogPanel';
import { findFreePosition, overlaps, halfExtents, getSize } from '../../utils/collision';

const CATALOG_BY_ROOM: Record<string, { type: string; label: string }[]> = {
  bedroom: [
    { type: 'bed', label: 'Bed' },
    { type: 'wardrobe', label: 'Wardrobe' },
    { type: 'nightstand', label: 'Nightstand' },
    { type: 'lamp', label: 'Lamp' },
    { type: 'rug', label: 'Rug' },
  ],
  kitchen: [
    { type: 'counter', label: 'Counter' },
    { type: 'stove', label: 'Stove' },
    { type: 'fridge', label: 'Fridge' },
    { type: 'table', label: 'Table' },
    { type: 'chair', label: 'Chair' },
  ],
  bathroom: [
    { type: 'toilet', label: 'Toilet' },
    { type: 'sink', label: 'Sink' },
    { type: 'shower', label: 'Shower' },
    { type: 'mirror', label: 'Mirror' },
    { type: 'shelf', label: 'Shelf' },
  ],
};

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roomId = parseInt(id!, 10);

  const [room, setRoom] = useState<Room | null>(null);
  const [furniture, setFurniture] = useState<FurniturePlacement[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    api
      .get(`/rooms/${roomId}`)
      .then((res) => {
        setRoom(res.data.room);
        setFurniture(res.data.furniture);
      })
      .catch(() => navigate('/dashboard'));

    return () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, [roomId, navigate]);

  const showNotice = (msg: string) => {
    setNotice(msg);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3000);
  };

  const updateWallColor = async (color: string) => {
    if (!room) return;
    setRoom({ ...room, wall_color: color });
    try {
      const res = await api.put(`/rooms/${roomId}`, { wall_color: color });
      setRoom(res.data.room);
    } catch {
      setError('Failed to update wall color');
    }
  };

  const updateFloorColor = async (color: string) => {
    if (!room) return;
    setRoom({ ...room, floor_color: color });
    try {
      const res = await api.put(`/rooms/${roomId}`, { floor_color: color });
      setRoom(res.data.room);
    } catch {
      setError('Failed to update floor color');
    }
  };

  const addFurniture = async (modelType: string) => {
    if (!room) return;
    try {
      const pos =
        modelType === 'mirror'
          ? { x: 0, z: -room.length / 2 + 0.05 }
          : findFreePosition(modelType, room.width, room.length, furniture);
      const res = await api.post(`/rooms/${roomId}/furniture`, {
        model_type: modelType,
        pos_x: pos.x,
        pos_y: modelType === 'mirror' ? 1.5 : 0,
        pos_z: pos.z,
        rot_y: 0,
        color: '#8B4513',
      });
      setFurniture([...furniture, res.data.furniture]);
    } catch {
      setError('Failed to add furniture');
    }
  };

  const deleteSelected = async () => {
    if (selectedId === null) return;
    try {
      await api.delete(`/rooms/${roomId}/furniture/${selectedId}`);
      setFurniture(furniture.filter((f) => f.id !== selectedId));
      setSelectedId(null);
    } catch {
      setError('Failed to remove furniture');
    }
  };

  const updateFurnitureColor = async (color: string) => {
    if (selectedId === null) return;
    try {
      const res = await api.put(`/rooms/${roomId}/furniture/${selectedId}`, {
        color,
      });
      setFurniture(
        furniture.map((f) => (f.id === selectedId ? res.data.furniture : f))
      );
    } catch {
      setError('Failed to update color');
    }
  };

  const updateFurnitureRotation = async (deg: number) => {
    if (selectedId === null || !room) return;
    const sel = furniture.find((f) => f.id === selectedId);
    if (!sel) return;

    const rad = (deg * Math.PI) / 180;
    if (sel.model_type !== 'mirror') {
      const size = getSize(sel.model_type);
      const extents = halfExtents(size.w, size.d, rad);
      if (
        Math.abs(sel.pos_x) + extents.hx > room.width / 2 - 0.02 ||
        Math.abs(sel.pos_z) + extents.hz > room.length / 2 - 0.02
      ) {
        showNotice('Furniture cannot overlap');
        return;
      }
    }
    const collides = furniture.some(
      (o) =>
        o.id !== selectedId &&
        overlaps(
          sel.pos_x,
          sel.pos_z,
          sel.model_type,
          rad,
          o.pos_x,
          o.pos_z,
          o.model_type,
          o.rot_y
        )
    );
    if (collides) {
      showNotice('Furniture cannot overlap');
      return;
    }

    try {
      const res = await api.put(`/rooms/${roomId}/furniture/${selectedId}`, {
        rot_y: rad,
      });
      setFurniture(
        furniture.map((f) => (f.id === selectedId ? res.data.furniture : f))
      );
    } catch {
      setError('Failed to update rotation');
    }
  };

  const handleDragEnd = useCallback(
    async (fid: number, position: [number, number, number]) => {
      setFurniture(
        furniture.map((f) =>
          f.id === fid
            ? { ...f, pos_x: position[0], pos_y: position[1], pos_z: position[2] }
            : f
        )
      );

      try {
        await api.put(`/rooms/${roomId}/furniture/${fid}`, {
          pos_x: position[0],
          pos_y: position[1],
          pos_z: position[2],
        });
      } catch {
        setError('Failed to save position');
      }
    },
    [roomId, furniture]
  );

  const selectedFurniture = furniture.find((f) => f.id === selectedId);

  if (!room) return <div className="loading">Loading...</div>;

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          &larr; Back
        </button>
        <h2>{room.name}</h2>
        <div className="toolbar-spacer" />
      </div>

      {error && <div className="error-bar">{error}</div>}
      {notice && <div className="notice-bar">{notice}</div>}

      <div className="editor-content">
        <div className="scene-container">
          <RoomScene
            width={room.width}
            length={room.length}
            wallColor={room.wall_color}
            floorColor={room.floor_color}
            ceilingColor={room.ceiling_color}
            furniture={furniture}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDragEnd={handleDragEnd}
            onCollision={() => showNotice('Furniture cannot overlap')}
          />
        </div>

        <div className="sidebar">
          <div className="sidebar-section">
            <h3>Colors</h3>
            <label>
              Wall:
              <input
                type="color"
                value={room.wall_color}
                onChange={(e) => updateWallColor(e.target.value)}
              />
            </label>
            <label>
              Floor:
              <input
                type="color"
                value={room.floor_color}
                onChange={(e) => updateFloorColor(e.target.value)}
              />
            </label>
          </div>

          <CatalogPanel
            items={CATALOG_BY_ROOM[room.room_type] || CATALOG_BY_ROOM.bedroom}
            onAdd={addFurniture}
          />

          {selectedFurniture && (
            <div className="sidebar-section">
              <h3>Selected: {selectedFurniture.model_type}</h3>
              <label>
                Color:
                <input
                  type="color"
                  value={selectedFurniture.color}
                  onChange={(e) => updateFurnitureColor(e.target.value)}
                />
              </label>
              <label className="range-label">
                Rotation:
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={Math.round((selectedFurniture.rot_y * 180) / Math.PI)}
                  onChange={(e) => updateFurnitureRotation(Number(e.target.value))}
                />
                <span className="range-value">
                  {Math.round((selectedFurniture.rot_y * 180) / Math.PI)}&deg;
                </span>
              </label>
              <button className="danger" onClick={deleteSelected}>
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}