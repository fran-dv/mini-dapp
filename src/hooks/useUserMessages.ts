import { useToastStore } from "@stores/useToastStore";

interface UseUserMessagesReturnType {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export const useUserMessages = (): UseUserMessagesReturnType => {
  const { openToast } = useToastStore();

  const showError = (message: string) => {
    openToast({ description: `❌ ${message}` });
  };

  const showSuccess = (message: string) => {
    openToast({ description: `✅ ${message}` });
  };

  return {
    showError,
    showSuccess,
  };
};

export default useUserMessages;
