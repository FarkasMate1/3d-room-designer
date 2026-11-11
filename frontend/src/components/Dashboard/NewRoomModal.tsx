import { useState, FormEvent } from 'react';

interface NewRoomModalProps {
  onClose: () => void;
  onCreate: (data: {
    name: string;
    room_type: string;
    width: number;
    length: number;
    wall_color: string;
  }) => Promise<void>;
}

interface RoomType {
  type: string;
  label: string;
  wallColor: string;
}

interface RoomSize {
  key: string;
  label: string;
  width: number;
  length: number;
  illusW: number;
  illusH: number;
}

const ROOM_TYPES: RoomType[] = [
  { type: 'bedroom', label: 'Bedroom', wallColor: '#e9c3a3' },
  { type: 'kitchen', label: 'Kitchen', wallColor: '#e8d3a8' },
  { type: 'bathroom', label: 'Bathroom', wallColor: '#9ccfe4' },
];

const ROOM_SIZES: RoomSize[] = [
  { key: 'small', label: 'Small', width: 3, length: 3, illusW: 40, illusH: 40 },
  { key: 'medium', label: 'Medium', width: 5, length: 5, illusW: 64, illusH: 64 },
  { key: 'large', label: 'Large', width: 7, length: 6, illusW: 84, illusH: 72 },
];

export default function NewRoomModal({ onClose, onCreate }: NewRoomModalProps) {
  const [step, setStep] = useState<'type' | 'size'>('type');
  const [roomType, setRoomType] = useState<RoomType>(ROOM_TYPES[0]);
  const [size, setSize] = useState<RoomSize>(ROOM_SIZES[1]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const selectType = (t: RoomType) => {
    setRoomType(t);
    setStep('size');
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a room name');
      return;
    }
    setError('');
    setCreating(true);
    try {
      await onCreate({
        name: name.trim(),
        room_type: roomType.type,
        width: size.width,
        length: size.length,
        wall_color: roomType.wallColor,
      });
    } catch {
      setError('Failed to create room');
      setCreating(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        {step === 'type' ? (
          <>
            <h3>Choose a room type</h3>
            <div className="type-options">
              {ROOM_TYPES.map((t) => (
                <button
                  key={t.type}
                  className="type-option"
                  onClick={() => selectType(t)}
                >
                  <span className="type-swatch" style={{ background: t.wallColor }} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <form onSubmit={handleCreate}>
            <h3>Room size</h3>
            <div className="size-options">
              {ROOM_SIZES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={`size-option ${size.key === s.key ? 'active' : ''}`}
                  onClick={() => setSize(s)}
                >
                  <div
                    className="size-illus"
                    style={{ width: s.illusW, height: s.illusH }}
                  >
                    <span>
                      {s.width}&times;{s.length}
                    </span>
                  </div>
                  <span className="size-label">{s.label}</span>
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Room name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            {error && <p className="error">{error}</p>}

            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setStep('type')}>
                Back
              </button>
              <button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}