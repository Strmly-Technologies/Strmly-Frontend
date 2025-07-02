import { create } from 'zustand';
// import { FormData } from '../components/ContentForm';

interface ContentFormStore {
  formData: Partial<FormData>;
  setFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
}

const useContentFormStore = create<ContentFormStore>((set) => ({
  formData: {},
  setFormData: (data) => set({ formData: { ...data } }),
  resetForm: () => set({ formData: {} }),
}));

export default useContentFormStore;