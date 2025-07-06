import Toast from 'react-native-toast-message';

export const showToast = (
  type: 'success' | 'error' | 'info',
  text1: string,
  text2?: string
) => {
  Toast.show({
    type,
    text1,
    text2,
    position: 'bottom',
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
    bottomOffset: 50,
  });
};

// Toast root component to be placed at the root of your app
export const ToastRoot = Toast;