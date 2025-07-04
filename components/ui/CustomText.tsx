import { Text, TextProps, TextStyle } from 'react-native';

interface CustomTextProps extends TextProps {
  variant?: string;
}

export default function CustomText({ variant = 'inter', style, ...props }: CustomTextProps) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: variant } as TextStyle, style]}
    />
  );
}
