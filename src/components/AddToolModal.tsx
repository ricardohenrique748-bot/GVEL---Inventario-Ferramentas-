import React, { useState } from 'react';
import { ToolItem } from '../types';

interface AddToolModalProps {
  onClose: () => void;
  onAddTool: (newTool: Omit<ToolItem, 'id'>) => void;
}

const CATEGORY_CODE_LETTER: Record<ToolItem['category'], string> = {
  'Ferramentas Elétricas': 'P',
  'Ferramentas Manuais': 'H',
  'Equip. de Diagnóstico': 'D',
  'Automotivo Especializado': 'S',
};

const generateToolCode = (category: ToolItem['category']) => {
  const letter = CATEGORY_CODE_LETTER[category];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TL-${letter}-${num}`;
};

export const AddToolModal: React.FC<AddToolModalProps> = ({ onClose, onAddTool }) => {
  const [newToolCode, setNewToolCode] = useState(() => generateToolCode('Ferramentas Elétricas'));
  const [newToolName, setNewToolName] = useState('');
  const [newToolBrand, setNewToolBrand] = useState('Milwaukee');
  const [newToolCategory, setNewToolCategory] = useState<ToolItem['category']>('Ferramentas Elétricas');
  const [newToolLocation, setNewToolLocation] = useState('Almoxarifado Principal - Prateleira A1');
  const [newToolPhoto, setNewToolPhoto] = useState<string | null>(null);

  const handleCategoryChange = (category: ToolItem['category']) => {
    setNewToolCategory(category);
    setNewToolCode(generateToolCode(category));
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
      status: 'available',
      lastAuditDate: new Date().toISOString().slice(0, 10),
      photoUrl: newToolPhoto || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-lg">
      <div className="bg-surface-container rounded-xl shadow-2xl w-full max-w-[36rem] border border-outline-variant/30 overflow-hidden animate-in zoom-in-95">
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
              <label
                htmlFor="tool-photo-input"
                className="w-20 h-20 shrink-0 rounded-lg border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-high flex items-center justify-center cursor-pointer overflow-hidden transition-colors"
              >
                {newToolPhoto ? (
                  <img src={newToolPhoto} alt="Pré-visualização da ferramenta" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant text-[28px]">add_a_photo</span>
                )}
              </label>
              <input
                id="tool-photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <div className="flex flex-col gap-xs">
                <span className="font-body-sm text-on-surface-variant">
                  {newToolPhoto ? 'Foto selecionada.' : 'Clique no quadro para escolher uma imagem.'}
                </span>
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
                  onClick={() => setNewToolCode(generateToolCode(newToolCategory))}
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
              value={newToolCategory}
              onChange={(e) => handleCategoryChange(e.target.value as ToolItem['category'])}
              className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none cursor-pointer"
            >
              <option value="Ferramentas Elétricas">Ferramentas Elétricas</option>
              <option value="Ferramentas Manuais">Ferramentas Manuais</option>
              <option value="Equip. de Diagnóstico">Equip. de Diagnóstico</option>
              <option value="Automotivo Especializado">Automotivo Especializado</option>
            </select>
          </div>

          <div className="flex flex-col gap-xs">
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
