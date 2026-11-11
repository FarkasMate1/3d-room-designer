interface CatalogItem {
  type: string;
  label: string;
}

interface CatalogPanelProps {
  items: CatalogItem[];
  onAdd: (type: string) => void;
}

export default function CatalogPanel({ items, onAdd }: CatalogPanelProps) {
  return (
    <div className="sidebar-section">
      <h3>Furniture</h3>
      <div className="catalog-list">
        {items.map((item) => (
          <button
            key={item.type}
            className="catalog-item"
            onClick={() => onAdd(item.type)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
