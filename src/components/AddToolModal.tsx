import React, { useState } from 'react';
import { ToolItem, Category } from '../types';

interface AddToolModalProps {
  onClose: () => void;
  onAddTool: (newTool: Omit<ToolItem, 'id'>) => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
}

const NEW_CATEGORY_OPTION = '__new_category__';

const getCategoryCodeLetter = (categoryName: string, categories: Category[]) => {
  const found = categories.find((c) => c.name === categoryName);
  if (found) return found.codeLetter;
  const letter = categoryName.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(letter) ? letter : 'X';
};

const generateToolCode = (category: string, categories: Category[]) => {
  const letter = getCategoryCodeLetter(category, categories);
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TL-${letter}-${num}`;
};

export const AddToolModal: React.FC<AddToolModalProps> = ({ onClose, onAddTool, categories, onAddCategory }) => {
  const [newToolCode, setNewToolCode] = useState(() =>
    generateToolCode(categories[0]?.name || '', categories)
  );
  const [newToolName, setNewToolName] = useState('');
  const [newToolBrand, setNewToolBrand] = useState('Milwaukee');
  const [newToolCategory, setNewToolCategory] = useState(categories[0]?.name || '');
  const [newToolLocation, setNewToolLocation] = useState('Almoxarifado Principal - Prateleira A1');
  const [newToolQuantity, setNewToolQuantity] = useState(1);
  const [newToolPhoto, setNewToolPhoto] = useState<string | null>(null);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleCategoryChange = (category: string) => {
    setNewToolCategory(category);
    setNewToolCode(generateToolCode(category, categories));
  };

  const handleCategorySelectChange = (value: string) => {
    if (value === NEW_CATEGORY_OPTION) {
      setShowNewCategoryForm(true);
      return;
    }
    setShowNewCategoryForm(false);
    handleCategoryChange(value);
  };

  const handleSaveNewCategory = () => {
    const name = newCategoryName.trim();
    if (!name) return;
    const existing = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (!existing) {
      onAddCategory(name);
    }
    handleCategoryChange(existing ? existing.name : name);
    setShowNewCategoryForm(false);
    setNewCategoryName('');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewToolPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName || !newToolCode) return;
    onAddTool({
      code: newToolCode,
      qrCode: `QR-${newToolCode}`,
      name: newToolName,
      brand: newToolBrand,
      category: newToolCategory,
      location: newToolLocation,
      quantity: newToolQuantity,
      status: 'available',
      lastAuditDate: new Date().toISOString().slice(0, 10),
      photoUrl: newToolPhoto || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-lg">
      <div className="bg-surface-container rounded-xl shadow-2xl w-full max-w-[36rem] max-h-[92vh] border border-outline-variant/30 overflow-y-auto animate-in zoom-in-95">
        <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Cadastrar Ferramenta
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-xs rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleAddSubmit} className="p-lg flex flex-col gap-md bg-surface">
          {/* Photo Upload */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant">
              Foto da ferramenta
            </label>
            <div className="flex items-center gap-md">
              <div className="w-20 h-20 shrink-0 rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-high flex items-center justify-center overflow-hidden">
                {newToolPhoto ? (
                  <img src={newToolPhoto} alt="Pré-visualização da ferramenta" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-[28px]">add_a_photo</span>
                )}
              </div>
              <div className="flex flex-col gap-xs flex-1">
                {/* Two separate inputs: one forces the camera app (capture),
                    the other opens the gallery/file picker (no capture attr) — a
                    plain file input alone doesn't reliably offer a camera option
                    on Android WebView. */}
                <div className="flex gap-xs">
                  <label
                    htmlFor="tool-photo-camera"
                    className="flex items-center gap-xs px-md py-xs rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm cursor-pointer border border-outline-variant/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    Tirar foto
                  </label>
                  <input
                    id="tool-photo-camera"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="tool-photo-gallery"
                    className="flex items-center gap-xs px-md py-xs rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm cursor-pointer border border-outline-variant/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_library</span>
                    Galeria
                  </label>
                  <input
                    id="tool-photo-gallery"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
                {newToolPhoto && (
                  <button
                    type="button"
                    onClick={() => setNewToolPhoto(null)}
                    className="font-label-sm text-error hover:opacity-70 transition-opacity text-left"
                  >
                    Remover foto
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-md">
            <div className="flex-1 flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Código interno
              </label>
              <div className="flex items-center gap-xs">
                <input
                  type="text"
                  readOnly
                  value={newToolCode}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant px-md py-sm text-body-md text-on-surface-variant font-label-md outline-none cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setNewToolCode(generateToolCode(newToolCategory, categories))}
                  title="Gerar novo código"
                  className="p-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                </button>
              </div>
              <span className="font-label-sm text-on-surface-variant/70">Gerado automaticamente</span>
            </div>
            <div className="flex-1 flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Marca
              </label>
              <input
                type="text"
                value={newToolBrand}
                onChange={(e) => setNewToolBrand(e.target.value)}
                className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant">
              Descrição / nome da ferramenta *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Catraca Sem Fio Milwaukee 3/8"
              value={newToolName}
              onChange={(e) => setNewToolName(e.target.value)}
              className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant">
              Categoria
            </label>
            <select
              value={showNewCategoryForm ? NEW_CATEGORY_OPTION : newToolCategory}
              onChange={(e) => handleCategorySelectChange(e.target.value)}
              className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
              <option value={NEW_CATEGORY_OPTION}>+ Cadastrar nova categoria</option>
            </select>
            {showNewCategoryForm && (
              <div className="flex items-center gap-xs mt-xs">
                <input
                  type="text"
                  autoFocus
                  placeholder="Nome da nova categoria"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveNewCategory();
                    }
                  }}
                  className="flex-1 bg-surface-container-high border-b-2 border-primary px-md py-sm text-body-md text-on-surface outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveNewCategory}
                  className="px-md py-sm bg-primary text-on-primary font-label-sm rounded shadow-sm hover:bg-primary-fixed transition-colors shrink-0"
                >
                  Adicionar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategoryForm(false);
                    setNewCategoryName('');
                  }}
                  className="px-md py-sm text-on-surface-variant font-label-sm hover:bg-surface-container-high rounded transition-colors shrink-0"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-md">
            <div className="flex-1 flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Local de armazenamento
              </label>
              <input
                type="text"
                value={newToolLocation}
                onChange={(e) => setNewToolLocation(e.target.value)}
                className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
              />
            </div>
            <div className="w-28 shrink-0 flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant">
                Quantidade
              </label>
              <input
                type="number"
                min={0}
                required
                value={newToolQuantity}
                onChange={(e) => setNewToolQuantity(Math.max(0, Number(e.target.value)))}
                className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
              />
            </div>
          </div>

          <div className="p-lg bg-surface-container flex justify-end gap-md border-t border-outline-variant/30 mt-md">
            <button
              type="button"
              onClick={onClose}
              className="px-lg py-sm text-on-surface font-label-md hover:bg-surface-container-high rounded transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-lg py-sm bg-primary text-on-primary font-label-md rounded shadow-sm hover:bg-primary-fixed transition-colors font-bold"
            >
              Salvar ferramenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
