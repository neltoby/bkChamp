import { Toast } from 'native-base';

export default (text) => {
  Toast.show(
    {
      text,
      buttonText: 'CLOSE',
    },
  );
};
